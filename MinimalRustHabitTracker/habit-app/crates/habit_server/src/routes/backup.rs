use axum::{extract::State, http::StatusCode, Json};
use habit_core::{BackupSnapshot, HabitStore};

pub async fn export_backup(State(store): State<HabitStore>) -> Result<Json<BackupSnapshot>, StatusCode> {
    store
        .export_snapshot()
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn restore_backup(
    State(store): State<HabitStore>,
    Json(snapshot): Json<BackupSnapshot>,
) -> Result<StatusCode, StatusCode> {
    store
        .restore_snapshot(snapshot)
        .map(|()| StatusCode::OK)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
