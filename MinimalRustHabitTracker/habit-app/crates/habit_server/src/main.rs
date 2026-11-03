use std::net::SocketAddr;

use habit_core::HabitStore;

#[tokio::main]
async fn main() {
    let store = HabitStore::new("habits.sqlite").expect("Failed to initialize SQLite store");
    let app = habit_server::app(store);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("HabitGrip server running on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
