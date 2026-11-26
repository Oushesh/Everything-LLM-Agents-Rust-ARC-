use futures_util::{SinkExt, StreamExt};
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("WebSocket server listening on ws://127.0.0.1:3000");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(async move {
            let mut ws_stream = accept_async(stream).await.expect("Handshake failed");
            while let Some(Ok(msg)) = ws_stream.next().await {
                if msg.is_text() || msg.is_binary() {
                    ws_stream.send(msg).await.unwrap();
                }
            }
        });
    }
}