use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{Html,IntoResponse},
    routing::{get, post},
    Json, Router,
};
use habit_core::HabitStore;
use serde::Deserialize;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    let store = HabitStore::new("habits.sqlite").expect("Failed to initialize SQLite store");

    let app = Router::new()
        .route("/",get(render_dashboard))
        .route("/api/health", get(health_check))
        .route("/api/habits", get(list_habits).post(create_habit))
        .route("/api/habits/{id}/log", post(log_habit))
        .layer(CorsLayer::permissive())
        .with_state(store);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 habit_server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> impl IntoResponse {
    Json(serde_json::json!({ "status": "ok", "service": "habit_server" }))
}

async fn list_habits(State(store): State<HabitStore>) -> Result<impl IntoResponse, StatusCode> {
    store
        .get_overview()
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

#[derive(Deserialize)]
struct CreateHabitPayload {
    title: String,
    habit_type: String,
    target_value: Option<f64>,
    unit: Option<String>,
    time_bucket: Option<String>,
}

async fn create_habit(
    State(store): State<HabitStore>,
    Json(payload): Json<CreateHabitPayload>,
) -> Result<impl IntoResponse, StatusCode> {
    let id = store
        .create_habit(
            &payload.title,
            &payload.habit_type,
            payload.target_value,
            payload.unit,
            payload.time_bucket,
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({ "id": id }))))
}

#[derive(Deserialize)]
struct LogHabitPayload {
    date: String,
    value: f64,
    is_skipped: Option<bool>,
}

async fn log_habit(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
    Json(payload): Json<LogHabitPayload>,
) -> Result<impl IntoResponse, StatusCode> {
    store
        .log_habit(
            &id,
            &payload.date,
            payload.value,
            payload.is_skipped.unwrap_or(false),
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::OK)
}

// Built-in minimalist frontend served at http://127.0.0.1:8080/

async fn render_dashboard() -> impl IntoResponse {
    Html(r#"<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HabitGrip (Rust Engine)</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-950 text-zinc-100 min-h-screen font-sans p-6 md:p-12">
  <div class="max-w-xl mx-auto space-y-8">
    <header class="flex justify-between items-center border-b border-zinc-800 pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Today's Focus</h1>
        <p class="text-xs text-zinc-400" id="current-date"></p>
      </div>
      <button onclick="document.getElementById('modal').classList.remove('hidden')" class="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">+ Habit</button>
    </header>

    <!-- Habit List -->
    <div id="habit-list" class="space-y-4">
      <div class="text-center py-12 text-zinc-500 text-sm">Loading habits...</div>
    </div>
  </div>

  <!-- Create Modal -->
  <div id="modal" class="fixed inset-0 bg-black/70 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
      <h2 class="text-lg font-semibold">New Habit</h2>
      <input id="new-title" type="text" placeholder="e.g. Overhead Press" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
      <select id="new-bucket" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500">
        <option value="morning">Morning</option>
        <option value="afternoon">Afternoon</option>
        <option value="evening">Evening</option>
      </select>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="document.getElementById('modal').classList.add('hidden')" class="px-3 py-1.5 text-zinc-400 hover:text-white text-sm">Cancel</button>
        <button onclick="createHabit()" class="bg-emerald-600 hover:bg-emerald-500 px-4 py-1.5 rounded-lg text-sm font-medium text-white">Save</button>
      </div>
    </div>
  </div>

  <script>
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    async function fetchHabits() {
      const res = await fetch('/api/habits');
      const habits = await res.json();
      const container = document.getElementById('habit-list');

      if (!habits.length) {
        container.innerHTML = '<div class="text-center py-12 text-zinc-500 text-sm">No habits configured yet. Tap "+ Habit" to begin.</div>';
        return;
      }

      container.innerHTML = habits.map(h => `
        <div class="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 shadow-sm hover:border-zinc-700 transition">
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-xs uppercase tracking-wider font-semibold text-zinc-500">${h.habit.time_bucket}</span>
              <h3 class="text-base font-medium">${h.habit.title}</h3>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-md">🔥 ${h.current_streak} d</span>
              <button onclick="toggleHabit('${h.habit.id}', ${!h.completed_today})" class="w-9 h-9 rounded-full flex items-center justify-center transition border ${h.completed_today ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-zinc-700 hover:border-zinc-500 text-transparent'}">✓</button>
            </div>
          </div>
          <!-- 365-day Heatmap Preview (last 52 days for compact display) -->
          <div class="mt-4 pt-3 border-t border-zinc-800/50 flex gap-[2px] overflow-x-auto py-1">
            ${h.heatmap.slice(-52).map(([date, intensity]) => `
              <div class="w-2 h-2 rounded-[1px] flex-shrink-0" style="background-color: ${intensity === 1.0 ? '#10b981' : intensity === 0.1 ? '#71717a' : '#27272a'}" title="${date}"></div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    async function toggleHabit(id, complete) {
      await fetch(`/api/habits/${id}/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today, value: complete ? 1.0 : 0.0, is_skipped: false })
      });
      fetchHabits();
    }

    async function createHabit() {
      const title = document.getElementById('new-title').value.trim();
      const time_bucket = document.getElementById('new-bucket').value;
      if (!title) return;

      await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, habit_type: 'boolean', time_bucket })
      });

      document.getElementById('new-title').value = '';
      document.getElementById('modal').classList.add('hidden');
      fetchHabits();
    }

    fetchHabits();
  </script>
</body>
</html>"#)
}


//So we could design every page for the future.
//Maybe tailwind css and stuffs here

// How do we do this for every page ?

