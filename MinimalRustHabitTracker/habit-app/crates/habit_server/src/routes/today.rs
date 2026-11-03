use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use chrono::{NaiveDate, Utc};
use habit_core::{HabitCardDto, HabitStore};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct TodayQuery {
    date: Option<String>,
}

pub async fn get_today_habits(
    State(store): State<HabitStore>,
    Query(query): Query<TodayQuery>,
) -> Result<Json<Vec<HabitCardDto>>, StatusCode> {
    let date = query
        .date
        .as_deref()
        .and_then(|value| NaiveDate::parse_from_str(value, "%Y-%m-%d").ok())
        .unwrap_or_else(|| Utc::now().date_naive());

    store
        .get_today_overview(date)
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}
