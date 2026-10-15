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


## From this derive the rust code that takes the vLLM internal representation of the distribution and the token and applies the rejection sampling algorithm.
   Define specific functions from above maybe: Input function, one function for the minium
   of (1.0, and division)
   
   

   fn minium(a:f32,b:f32)-> f32{
    c = a/b;
    return min(1.0,c)  
    }
