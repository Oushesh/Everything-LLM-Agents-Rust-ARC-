## OPtimising High-Dimensional Vectors with Binary Quantisation


## Binary Quantisation: definition
   what is it? Binary - usually means 0 or 1. So compressing values into binary didigts
   like 2 power of something.

   Function (x)
   if (x) > threshold: 0
    else 1


   Why are binary vectors so good? Because the other ones the big normal ones are over parametrised. 


   Embedding Retrieval Benchmark - bge-small -> scores 51.82 and the other one scores less. 

   why is that? 

   Advantage of Faster Search and Retrieval: 

   Difference between product quantisation and Binary Quantisation


    Binary Quantisation (BQ) --> you get Binary Quantisation if you convert any vector embedding of floating point numbers into a vector of binary or boolean values. 

    This feature is an extension of our past work on scalar quantisation where we convert float32 to uint8 and then leverage a specific SIMD CPU instruction to perform fast vector compression. 

    

## The Core Difference between Binary Quantisation (BQ) and Product Quantisation (PQ): 

    Binary Quantisation turns every numerical value in a vector of single bit (0 or 1). It is ultra-fast and compress data by up to 32x. 

    But it works only well where 