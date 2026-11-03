mod routes;

use std::path::PathBuf;

use axum::{routing::{get, post}, Json, Router};
use habit_core::HabitStore;
use serde_json::json;
use tower_http::{cors::CorsLayer, services::{ServeDir, ServeFile}};

pub fn app(store: HabitStore) -> Router {
    let static_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("static");
    let api = Router::new()
        .route("/api/health", get(|| async { Json(json!({ "status": "ok" })) }))
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
        .with_state(store);

    Router::new()
        .merge(api)
        .route_service("/", ServeFile::new(static_dir.join("index.html")))
        .nest_service("/static", ServeDir::new(static_dir))
        .layer(CorsLayer::permissive())
}
