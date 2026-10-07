## Draft Models: 
   Draft Models configures vLLM in an offline mode to use speculative decoding: speculating 5 tokens at a time.



## TLI Algorithm Overhead
   TLI stands: Token Level intersection.
   By default, you dont need to implement this since its already ready made avaialble onto the vLLM Framework.


   TLI Algorithmic Pseudocode: 
   
    ```python:

    # ----------------
    # Phase 1: Initialization (Run once on CPU/GPU)
    # ----------


    def init_tli_mapping():
        #
    ```