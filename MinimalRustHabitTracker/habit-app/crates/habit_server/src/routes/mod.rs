pub mod backup;
pub mod detail;
pub mod habits;
pub mod settings;
pub mod statistics;
pub mod today;

use axum::http::StatusCode;
use std::fmt::Display;

/// Log the real error before returning a 500, so the server terminal shows
/// what actually failed instead of an empty Internal Server Error.
pub fn log_error(context: &str, err: impl Display) -> StatusCode {
    eprintln!("[habit_server] {context} failed: {err}");
    StatusCode::INTERNAL_SERVER_ERROR
}
