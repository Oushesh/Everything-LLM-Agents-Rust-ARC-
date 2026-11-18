
//we use axum dependencies here and we would need IntoResponse from axum
// For Real time we can use something like tokio and axum 
// websocket client --> AI Agent World -> Tutorial from https://www.youtube.com/watch?v=p1ES0apOwUw
// 

use axum::{
    extract::{
        ws::{Message, WebSocket, WebSocketUpgrade},
        State,
    },
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};

use features_util::{SinkExt, StreamExt};
use serde::{Deserialize,Serialize};
use std::{env,sync::Arc};
use tokio::sync::Mutex;
use tokio_tungstenite::{

}



fn main() {
    println!("Hello, world!");
}
