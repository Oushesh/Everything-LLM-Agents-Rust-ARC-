/*
pub fn add(left: u64, right: u64) -> u64 {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
    */

    use rand::Rng;

    #[derive(Debug,PartialEq,Eq)]
    pub enum VerificationResult {
        Accepted(usize),
        RejectedAndResampled(usize),
    }

    pub struct SpeculativeSampler {
        vocab_size: usize,

        //// Pre-allocated scratchpad for residual distribution: max(0,p-q)
        residual_buf: Vec<f32>,
    }

    impl SpeculativeSampler {
        ////Initialize with the vocabulary size of your mdoel (e.g. 32 000, 128 256).
        pub fn new (vocab_size: usize)-> Self {
         Self {
            vocab_size,
            residual_buf: Vec<f32>,
        }
        

        //// Verifies a draft candidate 'x' without heap allocations.

        pub fn verify_token <R: Rng>(
            &mut self,
            p: &[f32],
            q: &[f32],
            target_token: usize,
            rng: &mut R
        ) -> VerificationResult {

            debug_assert_eq!(p.len(),self.vocab_size);
            debug_assert_eq!(q.len(),self.vocab_size);
            debug_assert!(x<self.vocab_size);
           
            let p_x = p[x];
            let q_x = q[x];


            // Acceptance ratio: min(1.0,p(x)/q(x))
            let acceptance_prob = if q_x > 0.0{
                (p_x/q_x).min(1.0)


            }else if p_x > 0.0 {
                1.0 
            }
                else {
                    0.0
                };

            let u: f32 = rng.gen();

            if u < acceptance_prob {
                VerificationResult::Accepted(x)
            }
        }
        
        }        
    }
