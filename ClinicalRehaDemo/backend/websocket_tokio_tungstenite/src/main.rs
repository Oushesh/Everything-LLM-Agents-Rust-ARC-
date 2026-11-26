use tokio_tungsteinite::{connect_async, tungstenite::protocol::Message};
use futures_util::{SinkEkt, StreamExt},
use tokio::io::{self,AsyncBufReadExt,BufReader};

#[tokio::main]
async fn main() {
    let url = "ws://localhost:3000";
    println!("Connecting to - {}", url);

    let (ws_stream, _) = connect_async(url)
        .await
        .expect("Failed to connect to WebSocket server");

    println!("Connected! Type a message and press Enter to send:");

    // Split into independent sink (write) and stream (read) halves
    let (mut write, mut read) = ws_stream.split();

    // Task 1: Concurrently listen for incoming messages from the server
    let read_task = tokio::spawn(async move {
        while let Some(message) = read.next().await {
            match message {
                Ok(Message::Text(text)) => println!("\n[Server]: {}", text),
                Ok(Message::Close(_)) => {
                    println!("\nServer closed connection.");
                    break;
                }
                Err(e) => {
                    eprintln!("\nError reading message: {}", e);
                    break;
                }
                _ => {} // Ignore Ping/Pong/Binary frames for simplicity
            }
        }
    });

    // Task 2: Concurrently read lines from stdin and send them to the server
    let write_task = tokio::spawn(async move {
        // Send initial greeting
        write
            .send(Message::Text("aloha echo server".into()))
            .await
            .expect("Failed to send initial message");

        let stdin = io::stdin();
        let mut lines = BufReader::new(stdin).lines();

        while let Ok(Some(line)) = lines.next_line().await {
            if line.trim().eq_ignore_ascii_case("exit") {
                let _ = write.send(Message::Close(None)).await;
                break;
            }
            if write.send(Message::Text(line.into())).await.is_err() {
                break;
            }
        }
    });

    // Wait for either task to finish (e.g., typing "exit" or server disconnect)
    tokio::select! {
        _ = read_task => {},
        _ = write_task => {},
    }

    println!("Disconnected.");
}