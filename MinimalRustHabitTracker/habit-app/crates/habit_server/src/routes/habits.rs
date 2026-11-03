use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use habit_core::{HabitStore, LogStatus};
use serde::Deserialize;
use serde_json::{json, Value};

#[derive(Deserialize)]
pub struct CreateHabitPayload {
    title: String,
    habit_type: Option<String>,
    target_value: Option<f64>,
    unit: Option<String>,
    icon_name: Option<String>,
    color_hex: Option<String>,
    is_task: Option<bool>,
    schedule_days: Option<Vec<u8>>,
}

pub async fn create_habit(
    State(store): State<HabitStore>,
    Json(payload): Json<CreateHabitPayload>,
) -> Result<(StatusCode, Json<Value>), StatusCode> {
    let id = store
        .create_habit(
            &payload.title,
            payload.habit_type.as_deref().unwrap_or("boolean"),
            payload.target_value,
            payload.unit,
            payload.icon_name,
            payload.color_hex,
            payload.is_task.unwrap_or(false),
            payload.schedule_days,
        )
        .map_err(|err| super::log_error("create_habit", err))?;

    Ok((StatusCode::CREATED, Json(json!({ "id": id }))))
}

#[derive(Deserialize)]
pub struct UpdateStatusPayload {
    date: String,
    status: String,
    value: Option<f64>,
    note: Option<String>,
}

pub async fn update_habit_status(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateStatusPayload>,
) -> Result<StatusCode, StatusCode> {
    let status = LogStatus::from_str(&payload.status);
    store
        .set_log_status(&id, &payload.date, status, payload.value, payload.note)
        .map_err(|err| super::log_error("update_habit_status", err))?;
    Ok(StatusCode::OK)
}
