use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use chrono::{Datelike, NaiveDate, Utc};
use habit_core::{HabitMonthResponse, HabitReminder, HabitStatsResponse, HabitStore};
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
        Err(err) => Err(super::log_error("get_habit_month", err)),
    }
}

pub async fn get_habit_statistics(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
) -> Result<Json<HabitStatsResponse>, StatusCode> {
    match store.get_habit_statistics(&id, Utc::now().date_naive()) {
        Ok(Some(body)) => Ok(Json(body)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(err) => Err(super::log_error("get_habit_statistics", err)),
    }
}

pub async fn list_reminders(
    State(store): State<HabitStore>,
) -> Result<Json<Vec<HabitReminder>>, StatusCode> {
    store
        .list_enabled_reminders()
        .map(Json)
        .map_err(|err| super::log_error("list_reminders", err))
}

pub async fn get_reminder(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
) -> Result<Json<HabitReminder>, StatusCode> {
    match store.get_reminder(&id) {
        Ok(Some(body)) => Ok(Json(body)),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(err) => Err(super::log_error("get_reminder", err)),
    }
}

pub async fn set_reminder(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
    Json(body): Json<ReminderBody>,
) -> Result<StatusCode, StatusCode> {
    if !valid_time(&body.remind_at) {
        return Err(StatusCode::BAD_REQUEST);
    }
    let reminder = HabitReminder {
        habit_id: id,
        enabled: body.enabled,
        remind_at: body.remind_at,
    };
    match store.set_reminder(reminder) {
        Ok(Some(())) => Ok(StatusCode::OK),
        Ok(None) => Err(StatusCode::NOT_FOUND),
        Err(err) => Err(super::log_error("set_reminder", err)),
    }
}

#[derive(Deserialize)]
pub struct ReminderBody {
    enabled: bool,
    remind_at: String,
}

fn valid_time(value: &str) -> bool {
    let Some((hour, minute)) = value.split_once(':') else {
        return false;
    };
    if hour.len() != 2 || minute.len() != 2 {
        return false;
    }
    matches!(
        (hour.parse::<u32>(), minute.parse::<u32>()),
        (Ok(hour), Ok(minute)) if hour < 24 && minute < 60
    )
}

fn parse_month(value: &str) -> Option<NaiveDate> {
    let (year, month) = value.split_once('-')?;
    if year.len() != 4 || month.len() != 2 {
        return None;
    }
    NaiveDate::from_ymd_opt(year.parse().ok()?, month.parse().ok()?, 1)
}
