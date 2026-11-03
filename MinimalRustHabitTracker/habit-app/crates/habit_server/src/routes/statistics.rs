use axum::{extract::State, http::StatusCode, Json};
use chrono::Utc;
use habit_core::{GlobalStatsResponse, HabitStore};

pub async fn get_statistics(
    State(store): State<HabitStore>,
) -> Result<Json<GlobalStatsResponse>, StatusCode> {
    store
        .get_global_statistics(Utc::now().date_naive())
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
