## Problem Statement: 
   In practice how would you save money if you were in a Company setting to and you had to decide to cut costs down when the number of documents keeps increasing and or the number of queries? 


## Which problem are we saving? The Reindexing Nightmare.

   Normally, the model encoding queries and model documents are tightly coupled.

   If you use a large model like Embedding 003 Large or Stella to embed your database of 50 millio ndocuments, the vector datbase stores vectors that exist in Stella's specific geometric space.

   So if you just sawp a simple lightweight for model from previously having had the heavy model, it wont work. 

   The geometric space in which the vectors live is completely different.

   To switch models normally, you would have to re-embed the entire corpus of 50 million documents - a process that costs lots of money. 

   A process that costs massive amounts of compute, time and database downtime.
   
## How they achieved "Hot-Swapping"
   
   1. Keeping the Document Index Fixed: 
   
   2. Distilling the Query Space: 
      * Instead of training the smaller models (Zero and Nano) from scratch on document retrieval, the authors trained them via knowledge disitllation 
      
      (KD Distillation, )

      Phase 1: The Knowledge Distillation (Training the Index)

      In deep Learning, KD typically forces a student model to match a teacher's soft output probabilities. In a vector index, KD forces a lightweight index to mimic the ranking order and structural distances of a heavy, precise index.


    Which algorithm exsits for KD? 
    KD: Knowledge Distillation --> Teacher trainer models 

    The goal is: 






