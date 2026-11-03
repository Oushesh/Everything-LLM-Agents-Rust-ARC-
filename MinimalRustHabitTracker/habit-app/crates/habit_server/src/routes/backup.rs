use std::path::PathBuf;

use axum::{extract::State, http::StatusCode, Json};
use chrono::Utc;
use habit_core::{BackupSnapshot, HabitStore};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

const MAX_STORED_BACKUPS: usize = 30;

pub async fn export_backup(State(store): State<HabitStore>) -> Result<Json<BackupSnapshot>, StatusCode> {
    store
        .export_snapshot()
        .map(Json)
        .map_err(|err| super::log_error("export_backup", err))
}

pub async fn restore_backup(
    State(store): State<HabitStore>,
    Json(snapshot): Json<BackupSnapshot>,
) -> Result<StatusCode, StatusCode> {
    store
        .restore_snapshot(snapshot)
        .map(|()| StatusCode::OK)
        .map_err(|err| super::log_error("restore_backup", err))
}

#[derive(Serialize)]
pub struct StoredBackup {
    name: String,
    size_bytes: u64,
}

pub async fn list_stored_backups(State(store): State<HabitStore>) -> Result<Json<Vec<StoredBackup>>, StatusCode> {
    maybe_daily_backup(&store);
    list_files().map(Json).map_err(|err| super::log_error("list_stored_backups", err))
}

pub async fn create_stored_backup(State(store): State<HabitStore>) -> Result<Json<Value>, StatusCode> {
    let name = write_backup_file(&store).map_err(|err| super::log_error("create_stored_backup", err))?;
    Ok(Json(json!({ "name": name })))
}

#[derive(Deserialize)]
pub struct RestoreStoredBody {
    name: String,
}

pub async fn restore_stored_backup(
    State(store): State<HabitStore>,
    Json(body): Json<RestoreStoredBody>,
) -> Result<StatusCode, StatusCode> {
    if !is_backup_name(&body.name) {
        return Err(StatusCode::BAD_REQUEST);
    }
    let text = std::fs::read_to_string(backups_dir().join(&body.name))
        .map_err(|err| super::log_error("restore_stored_backup read", err))?;
    let snapshot: BackupSnapshot = serde_json::from_str(&text)
        .map_err(|err| super::log_error("restore_stored_backup parse", err))?;
    store
        .restore_snapshot(snapshot)
        .map(|()| StatusCode::OK)
        .map_err(|err| super::log_error("restore_stored_backup", err))
}

fn backups_dir() -> PathBuf {
    PathBuf::from("backups")
}

fn is_backup_name(name: &str) -> bool {
    name.starts_with("backup-")
        && name.ends_with(".json")
        && !name.contains('/')
        && !name.contains('\\')
        && !name.contains("..")
}

fn list_files() -> std::io::Result<Vec<StoredBackup>> {
    let dir = backups_dir();
    if !dir.exists() {
        return Ok(Vec::new());
    }
    let mut files = Vec::new();
    for entry in std::fs::read_dir(&dir)? {
        let entry = entry?;
        let name = entry.file_name().to_string_lossy().to_string();
        if is_backup_name(&name) {
            let size_bytes = entry.metadata().map(|meta| meta.len()).unwrap_or(0);
            files.push(StoredBackup { name, size_bytes });
        }
    }
    files.sort_by(|a, b| b.name.cmp(&a.name));
    Ok(files)
}

/// Daily auto backup: when the setting is on and no backup file exists for
/// today yet, write one. Checked when the backup screen asks for the list,
/// so it needs no background scheduler.
fn maybe_daily_backup(store: &HabitStore) {
    let enabled = store.get_settings().map(|settings| settings.daily_backup).unwrap_or(false);
    if !enabled {
        return;
    }
    let today_prefix = format!("backup-{}", Utc::now().format("%Y%m%d"));
    let already = list_files()
        .map(|files| files.iter().any(|file| file.name.starts_with(&today_prefix)))
        .unwrap_or(false);
    if !already {
        if let Err(err) = write_backup_file(store) {
            eprintln!("[habit_server] daily auto backup failed: {err}");
        }
    }
}

fn write_backup_file(store: &HabitStore) -> Result<String, Box<dyn std::error::Error>> {
    let snapshot = store.export_snapshot()?;
    let dir = backups_dir();
    std::fs::create_dir_all(&dir)?;
    let name = format!("backup-{}.json", Utc::now().format("%Y%m%d-%H%M%S"));
    std::fs::write(dir.join(&name), serde_json::to_string_pretty(&snapshot)?)?;

    let mut files = list_files()?;
    while files.len() > MAX_STORED_BACKUPS {
        let oldest = files.pop().ok_or("backup list changed while pruning")?;
        let _ = std::fs::remove_file(dir.join(oldest.name));
    }
    Ok(name)
}
