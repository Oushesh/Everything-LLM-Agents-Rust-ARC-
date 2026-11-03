use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use chrono::{Datelike, NaiveDate, Utc};
use habit_core::{HabitMonthResponse, HabitStore};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct MonthQuery {
    month: Option<String>,
}

pub async fn get_habit_month(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
    Query(query): Query<MonthQuery>,
) -> Result<Json<HabitMonthResponse>, StatusCode> {
    let today = Utc::now().date_naive();
    let month_start = match query.month.as_deref() {
        Some(value) => parse_month(value).ok_or(StatusCode::BAD_REQUEST)?,
        None => NaiveDate::from_ymd_opt(today.year(), today.month(), 1).unwrap(),
    };

    match store.get_habit_month(&id, month_start, today) {
        Ok(Some(body)) => Ok(Json(body)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

fn parse_month(value: &str) -> Option<NaiveDate> {
    let (year, month) = value.split_once('-')?;
    if year.len() != 4 || month.len() != 2 {
        return None;
    }
    NaiveDate::from_ymd_opt(year.parse().ok()?, month.parse().ok()?, 1)
}
