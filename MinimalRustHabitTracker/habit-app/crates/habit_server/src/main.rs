use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{Html, IntoResponse},
    routing::{get, post},
    Json, Router,
};

use chrono::{NaiveDate, Utc};
use habit_core::{HabitStore, LogStatus};
use serde::Deserialize;
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    let store = HabitStore::new("habits.sqlite").expect("Failed to initialize SQLite store");

    let app = Router::new()
        .route("/", get(render_app))
        .route("/api/health", get(|| async { Json(serde_json::json!({ "status": "ok" })) }))
        .route("/api/today", get(get_today_habits))
        .route("/api/habits", post(create_habit))
        .route("/api/habits/{id}/status", post(update_habit_status))
        .route("/api/statistics", get(get_statistics))
        .layer(CorsLayer::permissive())
        .with_state(store);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 HabitGrip server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

#[derive(Deserialize)]
struct TodayQuery {
    date: Option<String>,
}

async fn get_today_habits(
    State(store): State<HabitStore>,
    Query(query): Query<TodayQuery>,
) -> Result<impl IntoResponse, StatusCode> {
    let date = query
        .date
        .and_then(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d").ok())
        .unwrap_or_else(|| Utc::now().date_naive());

    store
        .get_today_overview(date)
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

async fn get_statistics(State(store): State<HabitStore>) -> Result<impl IntoResponse, StatusCode> {
    let today = Utc::now().date_naive();
    store
        .get_global_statistics(today)
        .map(Json)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)
}

#[derive(Deserialize)]
struct CreateHabitPayload {
    title: String,
    habit_type: Option<String>,
    target_value: Option<f64>,
    unit: Option<String>,
    icon_name: Option<String>,
    color_hex: Option<String>,
    is_task: Option<bool>,
}

async fn create_habit(
    State(store): State<HabitStore>,
    Json(payload): Json<CreateHabitPayload>,
) -> Result<impl IntoResponse, StatusCode> {
    let id = store
        .create_habit(
            &payload.title,
            &payload.habit_type.unwrap_or_else(|| "boolean".into()),
            payload.target_value,
            payload.unit,
            payload.icon_name,
            payload.color_hex,
            payload.is_task.unwrap_or(false),
        )
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({ "id": id }))))
}

#[derive(Deserialize)]
struct UpdateStatusPayload {
    date: String,
    status: String, // "completed", "skipped", "failed", "pending"[cite: 2]
    value: Option<f64>,
    note: Option<String>,
}

async fn update_habit_status(
    State(store): State<HabitStore>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateStatusPayload>,
) -> Result<impl IntoResponse, StatusCode> {
    let status = LogStatus::from_str(&payload.status);
    store
        .set_log_status(&id, &payload.date, status, payload.value, payload.note)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::OK)
}

async fn render_app() -> impl IntoResponse {
    Html(r#"<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HabitGrip</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: { extend: {} }
    }
  </script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen flex flex-col justify-between font-sans transition-colors duration-200">
  <div class="max-w-md w-full mx-auto p-4 sm:p-6 flex-1 flex flex-col">
    <!-- Header -->
    <header class="flex justify-between items-center pb-4">
      <div class="flex items-center gap-3">
        <i class="fa-solid fa-bars text-lg text-zinc-500"></i>
        <h1 id="tab-title" class="text-xl font-bold">Today</h1>
      </div>
      <div class="flex items-center gap-3 text-zinc-500">
        <button onclick="toggleTheme()" class="p-1 hover:text-zinc-900 dark:hover:text-white"><i id="theme-icon" class="fa-solid fa-moon"></i></button>
        <i class="fa-solid fa-filter"></i>
        <i class="fa-regular fa-calendar-days"></i>
      </div>
    </header>

    <!-- Tab 1: Today Screen -->
    <div id="tab-today" class="tab-content space-y-4">
      <!-- 7-Day Date Strip -->
      <div id="date-strip" class="flex justify-between bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center"></div>

      <!-- Habit Cards Container -->
      <div id="card-list" class="space-y-3 pt-2"></div>
    </div>

    <!-- Tab 2: Habits 6-Month Heatmap Screen -->
    <div id="tab-habits" class="tab-content hidden space-y-4">
      <div id="matrix-list" class="space-y-4"></div>
    </div>

    <!-- Tab 3: Statistics Screen -->
    <div id="tab-statistics" class="tab-content hidden space-y-4">
      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 class="text-xs uppercase font-bold text-zinc-400">Streaks</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
            <span class="text-2xl font-bold text-indigo-500" id="stat-curr-streak">0</span>
            <p class="text-xs text-zinc-500 uppercase mt-1 font-semibold">Current Streak</p>
          </div>
          <div class="p-4 border-2 border-indigo-500/50 bg-indigo-500/5 rounded-xl">
            <span class="text-2xl font-bold text-indigo-600 dark:text-indigo-400" id="stat-best-streak">0</span>
            <p class="text-xs text-zinc-500 uppercase mt-1 font-semibold">Best Streak</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
        <h3 class="text-xs uppercase font-bold text-zinc-400">Completions</h3>
        <div class="grid grid-cols-2 gap-3 text-center">
          <div class="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"><span class="text-lg font-bold text-indigo-500" id="stat-comp-week">0</span><p class="text-xs text-zinc-400">This Week</p></div>
          <div class="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"><span class="text-lg font-bold text-indigo-500" id="stat-comp-month">0</span><p class="text-xs text-zinc-400">This Month</p></div>
          <div class="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"><span class="text-lg font-bold text-indigo-500" id="stat-comp-year">0</span><p class="text-xs text-zinc-400">This Year</p></div>
          <div class="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl"><span class="text-lg font-bold text-indigo-500" id="stat-comp-all">0</span><p class="text-xs text-zinc-400">All Time</p></div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <div class="fixed bottom-20 right-6 sm:right-auto sm:translate-x-96">
      <button onclick="document.getElementById('modal').classList.remove('hidden')" class="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition transform active:scale-95">+</button>
    </div>
  </div>

  <!-- Bottom Navigation Bar -->
  <nav class="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-2 sticky bottom-0">
    <div class="max-w-md mx-auto grid grid-cols-3 text-center text-xs">
      <button onclick="switchTab('today')" id="nav-today" class="flex flex-col items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
        <i class="fa-regular fa-calendar-check text-base"></i><span>Today</span>
      </button>
      <button onclick="switchTab('habits')" id="nav-habits" class="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
        <i class="fa-solid fa-shapes text-base"></i><span>Habits</span>
      </button>
      <button onclick="switchTab('statistics')" id="nav-statistics" class="flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
        <i class="fa-solid fa-chart-simple text-base"></i><span>Statistics</span>
      </button>
    </div>
  </nav>

  <!-- Create Habit Modal -->
  <div id="modal" class="fixed inset-0 bg-black/60 backdrop-blur-sm hidden flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
      <h2 class="text-lg font-bold">New Habit or Task</h2>
      <input id="new-title" type="text" placeholder="Title (e.g. Overhead Press, Drink Water)" class="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500">

      <div class="grid grid-cols-2 gap-2">
        <select id="new-type" class="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm">
          <option value="boolean">Boolean</option>
          <option value="numeric">Counter</option>
          <option value="duration">Timer</option>
        </select>
        <input id="new-target" type="number" value="1" placeholder="Target" class="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm">
      </div>

      <div class="flex items-center gap-2">
        <input id="new-is-task" type="checkbox" class="rounded text-indigo-600">
        <label for="new-is-task" class="text-sm text-zinc-600 dark:text-zinc-300">Is one-off task</label>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button onclick="document.getElementById('modal').classList.add('hidden')" class="px-4 py-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white text-sm">Cancel</button>
        <button onclick="createHabit()" class="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl text-sm font-semibold text-white transition">Save</button>
      </div>
    </div>
  </div>

  <script>
    let currentDate = new Date().toISOString().split('T')[0];
    let activeTab = 'today';

    function toggleTheme() {
      const html = document.documentElement;
      const isDark = html.classList.toggle('dark');
      document.getElementById('theme-icon').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    function switchTab(tab) {
      activeTab = tab;
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.getElementById(`tab-${tab}`).classList.remove('hidden');
      document.getElementById('tab-title').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);

      ['today', 'habits', 'statistics'].forEach(t => {
        const btn = document.getElementById(`nav-${t}`);
        if (t === tab) {
          btn.className = 'flex flex-col items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold';
        } else {
          btn.className = 'flex flex-col items-center gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200';
        }
      });

      if (tab === 'today') loadToday();
      if (tab === 'habits') loadHabitsMatrix();
      if (tab === 'statistics') loadStats();
    }

    function renderDateStrip() {
      const strip = document.getElementById('date-strip');
      const now = new Date(currentDate);
      const days = [];
      for (let i = -3; i <= 3; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        days.push(d);
      }
      strip.innerHTML = days.map(d => {
        const dStr = d.toISOString().split('T')[0];
        const isSelected = dStr === currentDate;
        return `
          <div onclick="setDate('${dStr}')" class="flex-1 cursor-pointer py-1.5 px-2 rounded-xl transition ${isSelected ? 'bg-indigo-600 text-white font-bold' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}">
            <div class="text-[10px] uppercase">${d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0,3)}</div>
            <div class="text-sm">${d.getDate()}</div>
          </div>
        `;
      }).join('');
    }

    function setDate(d) {
      currentDate = d;
      renderDateStrip();
      loadToday();
    }

    async function loadToday() {
      const res = await fetch(`/api/today?date=${currentDate}`);
      const items = await res.json();
      const list = document.getElementById('card-list');
      if (!items.length) {
        list.innerHTML = `<div class="text-center py-16 text-zinc-400 text-sm">No items. Tap "+" to add a habit or task.</div>`;
        return;
      }
      list.innerHTML = items.map(dto => `
        <div class="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white" style="background-color: ${dto.habit.color_hex}">
              <i class="fa-solid fa-${dto.habit.icon_name}"></i>
            </div>
            <div>
              <h4 class="font-medium text-sm leading-tight">${dto.habit.title}</h4>
              <p class="text-xs text-zinc-400 mt-0.5">${dto.display_progress}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="cycleStatus('${dto.habit.id}', '${dto.today_status}')" class="w-8 h-8 rounded-full flex items-center justify-center border transition ${getStatusStyle(dto.today_status)}">
              ${getStatusIcon(dto.today_status)}
            </button>
          </div>
        </div>
      `).join('');
    }

    function getStatusStyle(s) {
      if (s === 'completed') return 'bg-emerald-500 border-emerald-500 text-white';
      if (s === 'skipped') return 'bg-zinc-400 border-zinc-400 text-white';
      return 'border-zinc-300 dark:border-zinc-700 text-transparent';
    }

    function getStatusIcon(s) {
      if (s === 'completed') return '✓';
      if (s === 'skipped') return '—';
      return '';
    }

    async function cycleStatus(id, curr) {
      const nextStatus = curr === 'completed' ? 'skipped' : (curr === 'skipped' ? 'pending' : 'completed');
      await fetch(`/api/habits/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: currentDate, status: nextStatus, value: nextStatus === 'completed' ? 1.0 : 0.0 })
      });
      loadToday();
    }

    async function loadHabitsMatrix() {
      const res = await fetch(`/api/today?date=${currentDate}`);
      const items = await res.json();
      const container = document.getElementById('matrix-list');
      container.innerHTML = items.filter(i => !i.habit.is_task).map(dto => `
        <div class="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-2">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-sm">${dto.habit.title}</h4>
            <span class="text-xs font-semibold text-amber-500">🔥 ${dto.current_streak} days</span>
          </div>
          <div class="flex gap-[2px] overflow-x-auto py-2">
            ${dto.heatmap_6_months.map(([date, intensity]) => `
              <div class="w-2.5 h-2.5 rounded-[1px] flex-shrink-0" style="background-color: ${intensity === 1.0 ? dto.habit.color_hex : (intensity === 0.1 ? '#94a3b8' : '#27272a20')}" title="${date}"></div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    async function loadStats() {
      const res = await fetch('/api/statistics');
      const s = await res.json();
      document.getElementById('stat-curr-streak').textContent = s.current_streak;
      document.getElementById('stat-best-streak').textContent = s.best_streak;
      document.getElementById('stat-comp-week').textContent = s.completions_week;
      document.getElementById('stat-comp-month').textContent = s.completions_month;
      document.getElementById('stat-comp-year').textContent = s.completions_year;
      document.getElementById('stat-comp-all').textContent = s.completions_all_time;
    }

    async function createHabit() {
      const title = document.getElementById('new-title').value.trim();
      const habit_type = document.getElementById('new-type').value;
      const target_value = parseFloat(document.getElementById('new-target').value) || 1.0;
      const is_task = document.getElementById('new-is-task').checked;
      if (!title) return;

      await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, habit_type, target_value, is_task })
      });

      document.getElementById('new-title').value = '';
      document.getElementById('modal').classList.add('hidden');
      loadToday();
    }

    renderDateStrip();
    loadToday();
  </script>
</body>
</html>"#)
}