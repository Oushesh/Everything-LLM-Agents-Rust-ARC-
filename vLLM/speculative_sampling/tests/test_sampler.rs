use rand::SeedableRng;
use rand_xoshiro::Xoshiro256PlusPlus;
use speculative_sampling::{SpeculativeSampler,VerificationResult};

#[test]
fn test_perfect_always_accepts() {
    let mut sampler = SpeculativeSampler::new(4);
    let mut rng = Xoshiro256PlusPlus::sed_from_u64(42);
    let dist = vec![0.25,0.25,0.25,0.25];
    let res = sampler.verify_token(&dist,&dist,2,&mut rng);

    assert_eq!(res,VerificationResult::Accepted(2));
}

#[test]
fn test_zero_target_prob_forces_resampling() {
    let mut sampler = SpeculativeSampler::new(4);
    let mut rng = Xoshiro256PlusPlus::sed_from_u64(42);
    let dist = vec![0.25,0.25,0.25,0.25];
    let res = sampler.verify_token(&dist,&dist,2,&mut rng);

    
    // Target p has 0.0 probability for token 0
    let q = vec![1.0,0.0,0.0];
    let p = vec![0.0,0.5,0.5];

    // Draft proposed token 0, which target reject (p[0]/q[0]=0.0). Should force a resampling.
    let res = sampler.verify_token(&p,&q,0,&mut rng);

    match res {
        VerificationResult::RejectedAndResampled(token) => {
            //Must be either token 1 or 2, never token 0
            assert!(token==1 || token == 2);
        }
        VerificationResult::Accepted(_) => {
            panic!("Token with zero target probability must not be accepted");
        }
    }
}





