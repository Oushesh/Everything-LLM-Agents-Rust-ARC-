use axum::{extract::State, http::StatusCode, Json};
use habit_core::{AppSettings, HabitStore};

pub async fn get_settings(State(store): State<HabitStore>) -> Result<Json<AppSettings>, StatusCode> {
    store
        .get_settings()
        .map(Json)
        .map_err(|err| super::log_error("get_settings", err))
}

pub async fn set_settings(
    State(store): State<HabitStore>,
    Json(settings): Json<AppSettings>,
) -> Result<StatusCode, StatusCode> {
    store
        .set_settings(settings)
        .map(|()| StatusCode::OK)
        .map_err(|err| super::log_error("set_settings", err))
}
