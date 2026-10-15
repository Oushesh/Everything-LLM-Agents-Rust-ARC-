## Goal implement a custom rejection_sampling in rust.
   Rejection sampling as in the KV Cache speculative decoding.

##  Algorithm SpeculativeRejectionSampling
   Inputs: 
        - Draft distribution vector: q --> smaller model for speed
        - Target distribution vector: p --> target model (main big model)
        - Proposed token: x ~ q (from the smaller model)

    1. Compute acceptance threshold
         alpha = min(1.0, p[x]/q[x])

    2. Draw uniform random number
         u ~ Uniform(0,1)

    3. If u < alpha:
         Return (x, accepted = True)
       Else:
         Reject x. Compute residual distribution (accounting for bias)
         residual = max(0, p - q)  # element-wise
         p_res = residual / sum(residual)
         x_resampled ~ Categorical(p_res)
         Return (x_resampled, accepted = False)


         use rand::Rng;

pub enum VerificationResult {
    /// Token x was accepted.
    Accepted(usize),
    /// Token x was rejected; a replacement token was sampled from the residual distribution.
    RejectedAndResampled(usize),
}

/// Performs speculative decoding rejection sampling for a proposed token `x`.
///
/// - `p`: Target distribution vector (larger model), size = vocab_size.
/// - `q`: Draft distribution vector (smaller model), size = vocab_size.
/// - `x`: Candidate token sampled from `q`.
/// - `rng`: Random number generator.
pub fn verify_token<R: Rng>(
    p: &[f32],
    q: &[f32],
    x: usize,
    rng: &mut R,
) -> VerificationResult {
    debug_assert_eq!(p.len(), q.len(), "Vocab sizes must match");
    debug_assert!(x < p.len(), "Token index out of bounds");

    let p_x = p[x];
    let q_x = q[x];

    // Acceptance probability: min(1.0, p(x) / q(x))
    let acceptance_prob = if q_x > 0.0 {
        (p_x / q_x).min(1.0)
    } else if p_x > 0.0 {
        1.0
    } else {
        0.0
    };

    let u: f32 = rng.random(); // In rand 0.8: rng.gen()

    if u < acceptance_prob {
        VerificationResult::Accepted(x)
    } else {
        // Compute the positive residual distribution: max(0, p - q)
        let mut residuals = Vec::with_capacity(p.len());
        let mut residual_sum = 0.0f32;

        for (&p_val, &q_val) in p.iter().zip(q.iter()) {
            let diff = (p_val - q_val).max(0.0);
            residuals.push(diff);
            residual_sum += diff;
        }

        // Resample from normalized residual distribution via categorical sampling
        let resampled_token = sample_categorical(&residuals, residual_sum, rng);
        VerificationResult::RejectedAndResampled(resampled_token)
    }
}

/// Fast categorical sampling from unnormalized weights using a cumulative sum lookup.
fn sample_categorical<R: Rng>(weights: &[f32], total_weight: f32, rng: &mut R) -> usize {
    if total_weight <= 0.0 {
        // Fallback in case of numerical instability: pick uniform or argmax
        return 0;
    }

    let mut target: f32 = rng.random::<f32>() * total_weight;

    for (idx, &w) in weights.iter().enumerate() {
        if target < w {
            return idx;
        }
        target -= w;
    }

    weights.len() - 1
}

