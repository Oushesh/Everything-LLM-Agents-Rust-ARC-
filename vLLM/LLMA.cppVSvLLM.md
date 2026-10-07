Llamma.CPP


Llama 2 --> First open weight releases
LLM Release --> Downlaod save and run locally on my own machine.


Constraints of running Llama 02 on Local GPU:
llama.cpp vs vLLM: which local LLM Engine actually scales? 

Quantization allows to reduce the wieight of the mdoels so it fits on smaller RAM

The weights of the quantisation are following from 
Float16 --> Bfloat8 --> INT4
30GB -----------------> 4GB

  Some algorithmic advancements of quantisation are: Weight quantisation, TurboVec, Scalar and Vector Quantisation

  <Advantage and disadvantage of using them each of them>

  What about VLLM? 
  Take local LLM and scale it specially accelerators with Nvidia GPU and technologies such as Paged Attention:

  Think of your GPU Ram memory being in like sort of blocks where they:
  1. sit idle for long because of continuous batching
  2. we then have lets say 5/10 memory slots unused while the process finishes.

  So at any given time, we have ca. 50% idle memory usage. 

PAGE ATTENTION and its relationship to KV-Cache: 
Paged Attention KV Cache: So in the mechanism you will have,  weights that get propagated over the different layers and you save them in
the KV-Cache (Key-Value) so you can refer to the weights for the same incoming tokes.

Also, 

  <TODO> How does this technology work in real life? 

![paged attentionKV-Cache](paged_attention.gif)


