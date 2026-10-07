## Draft Models: 
   Draft Models configures vLLM in an offline mode to use speculative decoding: speculating 5 tokens at a time.


## Below is a digram of the TLI (Token Level )


## TLI Algorithm Overhead (Token Level Intersection: TLI)
   TLI stands: Token Level intersection.
   By default, you dont need to implement this since its already ready made avaialble onto the vLLM Framework.


   TLI Algorithmic Pseudocode: 
   

    ```python:

    # ----------------
    # Phase 1: Initialization (Run once on CPU/GPU)
    # ----------


    def init_tli_mapping():
        # Decode every token to raw normalized text/ bytes

        draft_str_to_id = {normalize(s): id for id,s in draft_tokenizer.get_vocab().items()}
        target_str_to_id = {normalize(s): id for id, s in target_tokenizer.get_vocab().items()}

        # Identify the exact intersection of surface forms
        intersection_strings = set(draft_str_to_id.keys()) & set(target_str_to_id.keys())

        # 1. Mask for Draft Model: Disallwo proposing tokens doesn't know
        draft_valid_mask = torch.zeros()

        # 2. Bidirectional lookup tensors (Fast GPU 1D Indexing)

        for s in intersection_strings: 
            d_id = draft_str_to_id[s]
            t_id = target_str_to_id[s]

            draft_valid_mask[d_id] = True
            draft_to_target[d_id] = t_id
            target_to_draft[t_id] = d_id

        return draft_valid_mask, draft_target, target_to_draft
    ```


# Visual Architecture: String Sets vs. Raw Bytes 
  ```rust

  Why String Sets Fail: 
  Token A (Tokenizer 1): "apple" (Standalone Word)
  Token B (Tokenizer 2): "Gapple" (Proceeding space in B)
  Token C (Tokenizer 3): " apple" (SentencePiece Prefix: 0x20 + 'apple')

  Python Set Check: 
  So a python check on a string level would not work since it would yield an empty string.

  {"apple"} & {"Ġapple"} & {" apple"} = Empty intersection

  Why B



  Why Byte-Normalized Intersection Succeds: 
  Decode to Raw Bytes: 
  Token A --> b'apple' 
  Token B --> b' apple' (G decoded to Ox20 space)
  Token C --> b' apple' ( decoded to Ox20 space)

  Intersection on b' apple':
  Draft ID: 1042 <--------- Exact Match -------> Target ID: 8901
  ```
   
  Why Intersecting Over Bytes Instead of Python Strings? 

  In modern LLM tokenizers (tiktoken, HuggingFace BPE, Sentence Piece), if done directly onto the string python level, it would miss most of the inte


## Minimal vLLM Configuration: 
   You can enable heterogeneous draft speculation by passing speculative_config with use_heteregeous_vocab: True.

    ```python:

    from vllm import LLM, SamplingParams

    # Example: Pairing a Qwen2.5 draft model with a Llama-3 target model
    # (different tokenizers, different vocab sizes)
    # The code is just written in way that you use config 
    llm = LLM(
        model="meta-llama/Meta-Llama-3-8B-Instruct",
        speculative_config= {
            "method": "draft_model",
            "model": "Qwen/Qwen2.5-0.5B-instruct",
            "num_speculative_tokens":3,
            "use_heteregenous_vocab": True, # Activates TLI Mapping
            "draft_sample_method": "greedy", # TLI requires greedy draft sampling
        },
    )

    prompts = ["Explain the concept of entropy in 3 stences:"]

    # The samplingParams is the rejection Samplign Algorithm: 

    sampling_params = SamplingParams
    outputs = llm.generate(prompts, Sampling_params)
    print (outputs[0].outpus[0].text)
    ```

## Why incompatible Embedding Spaces Don't break Speculative Decoing
   
   In standard speculative decoding:    
   1. The draft model generates K candidate tokens sequentially.
   2. The draft tokens are passed to target model as candidate inputs.
   3. The target model evaluates them in a single batched forward pass and verifies them.  

   The internal model activations, weight geometries and hidden embeddings (latentspace) are never passed to the target model. The target model looks up its own embeddings for whatever token IDs it receives.

   Where the Challenge Actually Lies: The Tokenizer Mismatch

   The difficulty comes from how different tokenizers segment the same text: 

   Token IDs do not align: 

   Token 

## Example Setup:
   ```python:
   from vllm import LLM, SamplingParams

   prompts = ["Explain the concept of entropy in 3 stences:"]

   sampling_params = SampingParams(temperature=0.8,top_p=0.95)
   
   llm = LLM(
        model="Qwen/Qwn3-8B",
        tensor_parallel_size=1,
        speculative_config={
            "model" : "Qwen/Qwen3-0.6B",
            "num_speculative_tokens" : 5,
            "method":"draft_model",
        },
   )

   outputs = llm.generate(prompts, sampling_params)
   # So I guess the data type here is: list of attribute of text

   for output in outputs:
    prompt = output.prompt
    generated_text = output.outputs[0].text
    print (f"Prompt: {prompt!r},Generated text: {generated_text!r}")
   ```
   
   The code used to request completions as a client remains unchanged: 

   ```rust:

   from openai import OpenAI

   # Modify OpenAI's API key and API base to use vLLM's API server.

   openai_api_key = "EMPTY"
   openai_api_base = "http://localhost:8000/v1"

   client = OpenAI(
    # defaults to os.environ.get("OPENAI_API_KEY")
    api_key=openai_api_key,
    base_url=openai_api_base,
   )

   models = client.models.list()
   model = models.data[0].id


   # Completion API
   stream = false
   completion = client.completions.create(
    model=model,
    prompt="The future of AI is",
    echo = False,
    n=1,
    stream=stream
   )

   print ("Completion result:")

   if stream:
        for c in completion:
            print (c)
    else:
        print (completion) 
   ```

## Reference: 
   * https://docs.vllm.ai/en/latest/features/speculative_decoding/draft_model/