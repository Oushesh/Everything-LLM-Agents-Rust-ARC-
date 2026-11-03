use axum::{extract::State, http::StatusCode, Json};
use habit_core::{AppSettings, HabitStore};

pub async fn get_settings(State(store): State<HabitStore>) -> Result<Json<AppSettings>, StatusCode> {
    store
        .get_settings()
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn set_settings(
    State(store): State<HabitStore>,
    Json(settings): Json<AppSettings>,
) -> Result<StatusCode, StatusCode> {
    store
        .set_settings(settings)
        .map(|()| StatusCode::OK)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
