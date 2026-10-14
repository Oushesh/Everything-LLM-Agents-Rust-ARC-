## What is new in the OCR and the pipeline of the past ? 

## New Procedures and what we propose?
   Instead of doing the old school part of the ocr pipeline and late interaction as dictated in the past
    which required visual models to represent the page with multiple 128 dim (example vectors) and then
    perform RAG systems operations on it, it represents extreme memory consumption 

    Instead of that we use quantisation systems that reduces the memory footprint of those vectors and memory systems
    This is exactly what the Engineers at qdrant did and perplexity. 


    The article stems from perplexity new retrieval has a size problem. 

    One page About 1700 Vectors. Late interaction helps keep one vector per token

    pplx-embed-v2-late turns each page into about 1700 vectors of 128 dimensions. 
    MaxSim scores a page by finding the best document-vector match for each query token and summing
    those matches. 


    856 KB per page in float32. 



    In an ideal world you want a quantisation such that the memory footprint is reduced as much as possible 
    while the quality of the task performed remained barely worsened up.


    nice so they use this TurboQuant as a service and apply it to all vectors pretty impressive.

    <add documents on this procedure and how to do things>
