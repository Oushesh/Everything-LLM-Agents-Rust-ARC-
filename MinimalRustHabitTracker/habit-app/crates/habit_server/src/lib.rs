mod routes;

use std::path::PathBuf;

use axum::{extract::State, http::StatusCode, routing::{get, post}, Json, Router};
use habit_core::HabitStore;
use serde_json::{json, Value};
use tower_http::{cors::CorsLayer, services::{ServeDir, ServeFile}};

async fn health(State(store): State<HabitStore>) -> (StatusCode, Json<Value>) {
    match store.missing_columns() {
        Ok(missing) if missing.is_empty() => (StatusCode::OK, Json(json!({ "status": "ok" }))),
        Ok(missing) => {
            eprintln!("[habit_server] health check: missing columns {missing:?}");
            (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(json!({ "status": "degraded", "missing_columns": missing })),
            )
        }
        Err(err) => {
            eprintln!("[habit_server] health check failed: {err}");
            (
                StatusCode::SERVICE_UNAVAILABLE,
                Json(json!({ "status": "degraded", "error": err.to_string() })),
            )
        }
    }
}

pub fn app(store: HabitStore) -> Router {
    let static_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("static");
    let api = Router::new()
        .route("/api/health", get(health))
        .route("/api/today", get(routes::today::get_today_habits))
        .route("/api/habits", post(routes::habits::create_habit))
        .route("/api/habits/{id}/status", post(routes::habits::update_habit_status))
        .route("/api/habits/{id}/month", get(routes::detail::get_habit_month))
        .route("/api/habits/{id}/statistics", get(routes::detail::get_habit_statistics))
        .route(
            "/api/habits/{id}/reminders",
            get(routes::detail::get_reminder).put(routes::detail::set_reminder),
        )
        .route("/api/statistics", get(routes::statistics::get_statistics))
        .route("/api/settings", get(routes::settings::get_settings).put(routes::settings::set_settings))
        .route("/api/backup", get(routes::backup::export_backup))
        .route("/api/backup/restore", post(routes::backup::restore_backup))
        .route(
            "/api/backups",
            get(routes::backup::list_stored_backups).post(routes::backup::create_stored_backup),
        )
        .route("/api/backups/restore", post(routes::backup::restore_stored_backup))
        .route("/api/reminders", get(routes::detail::list_reminders))
        .with_state(store);

    Router::new()
        .merge(api)
        .route_service("/", ServeFile::new(static_dir.join("index.html")))
        .nest_service("/static", ServeDir::new(static_dir))
        .layer(CorsLayer::permissive())
}
