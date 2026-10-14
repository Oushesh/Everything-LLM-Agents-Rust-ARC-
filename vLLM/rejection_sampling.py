## Rejection Sampling 

# Reference: https://www.youtube.com/watch?v=VkWlLSTdHs8
# https://www.youtube.com/watch?v=VkWlLSTdHs8


´´´Bash
   Algorithm SpeculativeRejectionSampling
   Inputs:
        - Draft distribution vector: q --> smaller model for speed 
        - Target distribution vetor: p --> target model (main big model)
        - Proposed token: x ~ q

    1. Compute acceptance threshold: 
       alpha = min(1.0, p(x)/q(x))
    2. Sample u ~ Uniform (0,1)

    3. If u < alpha:
         Return (x, accepted=True)
       Else:
         residual = max(0,0, p-q)
         p_res = residual/sum/(residual)
         x_resampled ~ Categorical (p_res)

         
´´´


´´´Python Completed Algorithm (Python/Pseudocode)
   
   import numpy as np 

   def speculative_rejection_sample(p:np.ndarray, q:np.ndarray,x:int):
        """
        Inputs: 
          - p: Target distribution vector (shape:)
          - q: Draft dis
          - x: proposed token sampled from q(x ~ Categorical(q))
        
        
        Returns:
            - (token, accepted:bool)
        
        """
        # 1. Acceptance threshold
        alpha = min(1.0, p[x]/q[x])

        # 2. Draw uniform random 


   if __name__ == "__main__":
       input = 
       function = 


´´´

