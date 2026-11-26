## Folder Structure

## Python vs Rust for This Websocket: 
   Websocket of rust has micro-seconds (us) latency of 1-2 us whereas python websocket:
   latency of 50-200 (us) this is a lot of difference.
   So go with the rust for production.

   Python has slightly per Frame overhead. Other reasons add up as well like Garbage collector. 

   Rust has lower memory footprint: 


   Rust would be using something like tokio-tungstenite/axum whereas Python would be using 
   websockets or starlette's websocket module. 

   For fast sensor data reading or LLM Applications of audio or Streaming Rust works better.