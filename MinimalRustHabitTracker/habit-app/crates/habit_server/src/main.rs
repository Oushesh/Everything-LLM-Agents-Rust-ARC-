fn main() {
    println!("Hello, world!");
}


//serde json, extract Path and State

use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get,post},
    Json, Router,
};
use habit_core::HabitScore;
use serde::Deserialize;
use std::net::SocktAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main () {
    let store = HabitStore::new("habits.sqlite").expect("Failed to initialize SQLite store");

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/habits", get(list_habits).post(create_habit))
        .route("/api/habits/{id}/log", post(log_habit))
        .layer(CorsLayer::permissive())
        .with_state(store);

    let addr = SocketAddr::from(());
    printlin!("habit_server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind().await.unwrap();
    axum::serve(listener,app).await.unwrap();
}

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!{"status":"ok", "service":"habit_server"})
}

async fn list_habits(State(store): State<HabitStore>) -> Result<impl IntoResponse, StatusCode> {
    store
        .get_overview()
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

#[derive(Deserialize)]
struct CreateHabitPayload {
    title: String,
    habit_type: String,
    target_value: Option<f64>,
    unit: Option<String>,
    time_bucket: Option<String>,
}

async fn create_habit(
    State(store): State<HabitStore>,
    Json(payload): Json<CreateHabitPayload>,
) -> Result<impl IntoResponse, StatusCode> {
    let id = store
        .create_habit(
            &payload.title,
            &payload.habit_type,
            payload.target_value,
            payload.unit,
            payload.time_bucket,
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({ "id": id }))))
}




// In axum we implement into Response