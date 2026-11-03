/* Generated from frontend/src. Edit the TypeScript, then run npm run build. */
"use strict";
(() => {
  // src/views/backup.ts
  function renderBackup(app, root) {
    const daily = app.state.settings?.daily_backup ?? false;
    root.innerHTML = `
    <div class="space-y-4">
      <p class="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
        Create Backup downloads your habits, tasks, and logs as JSON. Restore replaces what is stored on this server with that file. Nothing is uploaded.
      </p>
      <button type="button" data-action="download-backup" class="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Create Backup</span><span class="text-xs text-zinc-400">Download a new checkpoint</span></span>
        <i class="fa-solid fa-chevron-right text-zinc-400"></i>
      </button>
      <label class="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Restore from Backup</span><span class="text-xs text-zinc-400">Choose a JSON file from this app</span></span>
        <input id="restore-file" type="file" accept="application/json,.json" class="hidden">
        <i class="fa-solid fa-chevron-right text-zinc-400"></i>
      </label>
      <label class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Daily auto backup</span><span class="text-xs text-zinc-400">Remember this choice on this server</span></span>
        <input id="daily-backup" type="checkbox" ${daily ? "checked" : ""}>
      </label>
    </div>`;
  }

  // src/views/detail.ts
  function renderDetail(app, root) {
    const detail = app.state.detail;
    if (!detail) {
      root.innerHTML = `<p class="py-16 text-center text-sm text-zinc-400">Loading this habit.</p>`;
      return;
    }
    const tabs = ["overview", "calendar", "statistics", "reminders"].map((tab) => {
      const active = tab === app.state.detailTab;
      return `<button type="button" data-action="detail-tab" data-tab="${tab}" class="rounded-full px-3 py-1 text-sm capitalize ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-500"}">${tab}</button>`;
    }).join("");
    const bodies = {
      overview: detailOverview(app, detail),
      calendar: detailCalendar(app, detail),
      statistics: detailStats(app),
      reminders: detailNotes(app, detail)
    };
    root.innerHTML = `<div class="mb-4 flex gap-1 overflow-x-auto">${tabs}</div>${bodies[app.state.detailTab]}`;
  }
  function detailOverview(app, detail) {
    const day = detail.days.find((item) => item.date === app.state.selectedDay) ?? detail.days[0];
    if (!day) return `<p class="py-16 text-center text-sm text-zinc-400">This month has no days.</p>`;
    return `
    <section class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p class="text-xs uppercase text-zinc-400">${app.esc(detail.habit.habit_type)} \xB7 target ${detail.habit.target_value}</p>
      <p class="text-sm">${app.esc(day.date)} is ${app.esc(day.status.replace(/_/g, " "))}</p>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"><div class="text-2xl font-bold text-indigo-500">${detail.current_streak}</div><p class="text-xs text-zinc-400">Current streak</p></div>
        <div class="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"><div class="text-2xl font-bold text-indigo-500">${detail.best_streak}</div><p class="text-xs text-zinc-400">Best streak</p></div>
      </div>
    </section>`;
  }
  function detailCalendar(app, detail) {
    const [year, month] = app.state.month.split("-").map(Number);
    const first = new Date(year, month - 1, 1);
    const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    const leading = (first.getDay() + 6) % 7;
    const cells = Array.from({ length: leading }, () => `<span></span>`);
    const skipped = detail.days.some((day) => day.status === "skipped");
    for (const day of detail.days) {
      const selected2 = day.date === app.state.selectedDay;
      const date = app.parseISO(day.date);
      cells.push(`
      <button type="button" data-action="select-day" data-date="${day.date}" class="flex aspect-square flex-col items-center justify-center rounded-xl text-xs ${dayClass(day.status)} ${selected2 ? "ring-2 ring-indigo-500" : ""}">
        <span>${date.getDate()}</span>
        <span>${app.statusIcon(day.status) || (day.has_note ? "\u2022" : "")}</span>
      </button>`);
    }
    const selected = detail.days.find((day) => day.date === app.state.selectedDay) ?? detail.days[0];
    if (!selected) return `<p class="py-16 text-center text-sm text-zinc-400">This month has no days.</p>`;
    return `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <button type="button" data-action="shift-month" data-delta="-1" class="h-9 w-9 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Previous month">\u2039</button>
        <h3 class="font-semibold">${label}</h3>
        <button type="button" data-action="shift-month" data-delta="1" class="h-9 w-9 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Next month">\u203A</button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-zinc-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      <div class="grid grid-cols-7 gap-1">${cells.join("")}</div>
      <div class="flex flex-wrap gap-2">
        ${skipped ? `<span class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">On vacation</span>` : ""}
        ${detail.current_streak > 0 ? `<span class="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Streak kept</span>` : ""}
      </div>
      <button type="button" data-action="vacation-week" data-date="${selected.date}" class="w-full rounded-xl border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-600">Mark the week of ${selected.date} as vacation</button>
      <button type="button" data-action="cycle" data-id="${app.esc(detail.habit.id)}" data-date="${selected.date}" data-status="${selected.status}" class="w-full rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">Cycle ${selected.date}</button>
      <div class="grid grid-cols-2 gap-2 text-xs text-zinc-500">
        <span>\u2713 Completed</span><span>\xD7 Failed</span><span>\u2013 Skipped</span><span>\u203A In progress</span><span>\u25CB Pending</span><span>\u2022 Has note</span>
      </div>
    </section>`;
  }
  function dayClass(status) {
    if (status === "completed") return "bg-emerald-100 text-emerald-700";
    if (status === "failed") return "bg-rose-100 text-rose-600";
    if (status === "skipped") return "bg-zinc-200 text-zinc-500 dark:bg-zinc-800";
    if (status === "in_progress") return "bg-sky-100 text-sky-700";
    return "bg-white text-zinc-600 dark:bg-zinc-900";
  }
  function detailStats(app) {
    const stats = app.state.habitStats;
    if (!stats) return `<p class="py-16 text-center text-sm text-zinc-400">Statistics are still loading.</p>`;
    const tile = (value, label) => `
    <div class="rounded-xl bg-zinc-50 p-3 text-center dark:bg-zinc-800/50">
      <div class="text-lg font-bold text-indigo-500">${value}</div>
      <p class="text-xs text-zinc-400">${label}</p>
    </div>`;
    return `
    <section class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><div class="text-2xl font-bold text-indigo-500">${stats.current_streak}</div><p class="text-xs text-zinc-400">Current streak</p></div>
        <div class="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"><div class="text-2xl font-bold text-indigo-500">${stats.best_streak}</div><p class="text-xs text-zinc-400">Best streak</p></div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        ${tile(stats.completions_week, "This week")}
        ${tile(stats.completions_month, "This month")}
        ${tile(stats.completions_year, "This year")}
        ${tile(stats.completions_all_time, "All time")}
      </div>
    </section>`;
  }
  function detailNotes(app, detail) {
    const selected = detail.days.find((day) => day.date === app.state.selectedDay) ?? detail.days[0];
    if (!selected) return `<p class="py-16 text-center text-sm text-zinc-400">This month has no days.</p>`;
    const reminder = app.state.reminder;
    const notes = detail.days.filter((day) => day.has_note).map((day) => `<li>${app.esc(day.date)}</li>`).join("");
    return `
    <section class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 class="text-sm font-semibold">Reminder</h3>
      <label class="flex items-center gap-2 text-sm">
        <input id="reminder-enabled" type="checkbox" ${reminder?.enabled ? "checked" : ""}>
        Remind me
      </label>
      <input id="reminder-time" type="time" value="${app.esc(reminder?.remind_at ?? "09:00")}" class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
      <button type="button" data-action="save-reminder" class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Save reminder</button>
      <h3 class="pt-2 text-sm font-semibold">Note for ${selected.date}</h3>
      <input id="day-note" type="text" placeholder="Write a note" class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
      <button type="button" data-action="save-note" class="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">Save note</button>
      <ul class="list-disc pl-5 text-sm text-zinc-500">${notes || "<li>No notes this month.</li>"}</ul>
    </section>`;
  }

  // src/views/habits.ts
  function renderHabits(app, root) {
    const habits = app.state.todayItems.filter((item) => !item.habit.is_task);
    if (!habits.length) {
      root.innerHTML = `<p class="py-16 text-center text-sm text-zinc-400">Recurring habits show a six-month grid here.</p>`;
      return;
    }
    root.innerHTML = `<div class="space-y-4">${habits.map((item) => habitGrid(app, item)).join("")}</div>`;
  }
  function habitGrid(app, dto) {
    const habit = dto.habit;
    const color = /^#[0-9a-fA-F]{3,8}$/.test(habit.color_hex) ? habit.color_hex : "#6366f1";
    const icon = /^[a-z0-9-]+$/i.test(habit.icon_name) ? habit.icon_name : "check";
    const points = dto.heatmap_6_months;
    const byDate = new Map(points);
    const first = points.length ? app.parseISO(points[0][0]) : /* @__PURE__ */ new Date();
    const last = points.length ? app.parseISO(points[points.length - 1][0]) : first;
    const cursor = new Date(first);
    cursor.setDate(cursor.getDate() - (cursor.getDay() + 6) % 7);
    const columns = [];
    while (cursor <= last) {
      const cells = [];
      let label = "";
      for (let row = 0; row < 7; row += 1) {
        const iso = app.formatISO(cursor);
        if (cursor.getDate() === 1) label = cursor.toLocaleDateString("en-US", { month: "short" });
        const intensity = byDate.has(iso) ? byDate.get(iso) : null;
        cells.push(`<i class="block h-2.5 w-2.5 rounded-[2px]" style="background:${heatColor(intensity, color)}" title="${iso}"></i>`);
        cursor.setDate(cursor.getDate() + 1);
      }
      columns.push(`<div class="flex flex-col gap-[2px]"><span class="h-3 text-[9px] text-zinc-400">${label}</span>${cells.join("")}</div>`);
    }
    return `
    <article data-action="open-habit" data-id="${app.esc(habit.id)}" class="cursor-pointer space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full text-white" style="background:${color}"><i class="fa-solid fa-${icon}"></i></div>
          <div>
            <h4 class="text-sm font-semibold">${app.esc(habit.title)}</h4>
            <p class="text-xs text-amber-500">${dto.current_streak} day streak</p>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <div class="grid grid-rows-7 gap-[2px] pt-4 text-[9px] leading-[10px] text-zinc-400"><span>M</span><span></span><span>W</span><span></span><span>F</span><span></span><span></span></div>
        <div class="flex gap-[2px] overflow-x-auto">${columns.join("")}</div>
      </div>
    </article>`;
  }
  function heatColor(intensity, color) {
    if (intensity == null) return "rgba(113,113,122,0.18)";
    if (intensity >= 0.9) return color;
    if (intensity >= 0.4) return `${color}88`;
    if (intensity > 0) return "#94a3b8";
    return "rgba(113,113,122,0.18)";
  }

  // src/views/statistics.ts
  function renderStatistics(app, root) {
    const stats = app.state.stats;
    if (!stats) {
      root.innerHTML = `<p class="py-16 text-center text-sm text-zinc-400">Statistics are still loading.</p>`;
      return;
    }
    const tile = (value, label) => `
    <div class="rounded-xl bg-zinc-50 p-3 text-center dark:bg-zinc-800/50">
      <div class="text-lg font-bold text-indigo-500">${value}</div>
      <p class="text-xs text-zinc-400">${label}</p>
    </div>`;
    root.innerHTML = `
    <div class="space-y-4">
      <section class="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div>
          <h3 class="text-sm font-semibold">All habits</h3>
          <p class="text-xs text-zinc-400">${stats.active_habits_count} active habits</p>
        </div>
        <div class="grid grid-cols-2 gap-4 text-center">
          <div><div class="text-2xl font-bold text-indigo-500">${stats.scheduled_this_week}</div><p class="text-xs text-zinc-400">Scheduled this week</p></div>
          <div><div class="text-2xl font-bold text-indigo-500">${stats.scheduled_this_month}</div><p class="text-xs text-zinc-400">Scheduled this month</p></div>
        </div>
      </section>
      <section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 class="text-xs font-bold uppercase text-zinc-400">Streaks</h3>
        <div class="mt-3 grid grid-cols-2 gap-4">
          <div class="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
            <div class="text-2xl font-bold text-indigo-500">${stats.current_streak}</div>
            <p class="mt-1 text-xs font-semibold uppercase text-zinc-500">Current streak</p>
          </div>
          <div class="rounded-xl border-2 border-indigo-500/50 bg-indigo-500/5 p-4">
            <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${stats.best_streak}</div>
            <p class="mt-1 text-xs font-semibold uppercase text-zinc-500">Best streak</p>
          </div>
        </div>
      </section>
      <section class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 class="text-xs font-bold uppercase text-zinc-400">Completions</h3>
        <div class="grid grid-cols-2 gap-3">
          ${tile(stats.completions_week, "This week")}
          ${tile(stats.completions_month, "This month")}
          ${tile(stats.completions_year, "This year")}
          ${tile(stats.completions_all_time, "All time")}
        </div>
      </section>
    </div>`;
  }

  // src/views/tasks.ts
  function renderTasks(app, root) {
    const tasks = app.state.todayItems.filter((item) => item.habit.is_task);
    const visible = tasks.filter((item) => !(app.state.hideCompleted && item.today_status === "completed"));
    const cards = visible.length ? visible.map((item) => app.card(item, app.state.date)).join("") : `<p class="py-16 text-center text-sm text-zinc-400">No tasks for this day.</p>`;
    root.innerHTML = `<div class="space-y-3">${cards}</div>`;
  }

  // src/views/today.ts
  function renderToday(app, root) {
    const selected = app.parseISO(app.state.date);
    const days = [];
    for (let offset = -3; offset <= 3; offset += 1) {
      const day = new Date(selected);
      day.setDate(selected.getDate() + offset);
      days.push(day);
    }
    const strip = days.map((day) => {
      const iso = app.formatISO(day);
      const active = iso === app.state.date;
      return `
      <button type="button" data-action="set-date" data-date="${iso}" class="flex-1 rounded-xl py-1.5 ${active ? "bg-indigo-600 font-bold text-white" : "text-zinc-500"}">
        <div class="text-[10px] uppercase">${day.toLocaleDateString("en-US", { weekday: "short" })}</div>
        <div class="text-sm">${day.getDate()}</div>
      </button>`;
    }).join("");
    const weekday = (selected.getDay() + 6) % 7;
    const items = app.state.todayItems.filter((item) => {
      if (app.state.hideCompleted && item.today_status === "completed") return false;
      if (item.habit.is_task) return true;
      const days2 = item.habit.schedule_days;
      return !Array.isArray(days2) || days2.length === 0 || days2.includes(weekday);
    });
    const cards = items.length ? items.map((item) => app.card(item, app.state.date)).join("") : `<p class="py-16 text-center text-sm text-zinc-400">Nothing for this day. Use + to add a habit or task.</p>`;
    root.innerHTML = `
    <div class="mb-4 flex justify-between rounded-2xl border border-zinc-200 bg-white p-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">${strip}</div>
    <div class="space-y-3">${cards}</div>`;
  }

  // src/types.ts
  function isTab(value) {
    return value === "today" || value === "habits" || value === "tasks" || value === "statistics";
  }
  function isDetailTab(value) {
    return value === "overview" || value === "calendar" || value === "statistics" || value === "reminders";
  }
  function isHabitType(value) {
    return value === "boolean" || value === "numeric" || value === "duration";
  }
  function isSnapshot(value) {
    if (!value || typeof value !== "object") return false;
    const record = value;
    return Array.isArray(record.habits) && Array.isArray(record.logs);
  }

  // src/app.ts
  var ICONS = { boolean: "check", numeric: "hashtag", duration: "clock" };
  var COLORS = { boolean: "#6366F1", numeric: "#10B981", duration: "#8B5CF6" };
  var HabitApp = class {
    constructor() {
      const today = formatISO(/* @__PURE__ */ new Date());
      this.state = {
        theme: localStorage.getItem("habitgrip-theme") === "dark" ? "dark" : "light",
        tab: "today",
        date: today,
        habitId: null,
        detailTab: "calendar",
        month: today.slice(0, 7),
        selectedDay: today,
        hideCompleted: false,
        menuOpen: false,
        backupOpen: false,
        todayItems: [],
        stats: null,
        habitStats: null,
        reminder: null,
        settings: null,
        detail: null,
        error: ""
      };
    }
    boot() {
      this.applyTheme();
      document.body.addEventListener("click", (event) => this.onClick(event));
      document.body.addEventListener("change", (event) => this.onChange(event));
      void this.refresh();
    }
    onClick(event) {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest("[data-action]");
      if (!target) {
        if (this.state.menuOpen && !event.target.closest("#menu")) {
          this.state.menuOpen = false;
          this.render();
        }
        return;
      }
      void this.onAction(target);
    }
    onChange(event) {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const file = target.files?.[0];
      if (target.id === "restore-file" && file) void this.restoreFile(file);
      if (target.id === "daily-backup") void this.saveSettings(target.checked);
    }
    async onAction(target) {
      const action = target.dataset.action;
      if (action === "toggle-menu") {
        this.state.menuOpen = !this.state.menuOpen;
        this.render();
        return;
      }
      if (action === "toggle-theme") {
        this.state.theme = this.state.theme === "dark" ? "light" : "dark";
        localStorage.setItem("habitgrip-theme", this.state.theme);
        this.applyTheme();
        this.render();
        return;
      }
      if (action === "toggle-filter") {
        this.state.hideCompleted = !this.state.hideCompleted;
        this.render();
        return;
      }
      if (action === "open-create") {
        input("new-is-task").checked = this.state.tab === "tasks";
        this.showModal(true);
        return;
      }
      if (action === "close-create") {
        this.showModal(false);
        return;
      }
      if (action === "create-habit") {
        await this.createHabit();
        return;
      }
      if (action === "switch-tab") {
        if (!isTab(target.dataset.tab)) return;
        this.state.tab = target.dataset.tab;
        this.state.habitId = null;
        this.state.backupOpen = false;
        this.state.menuOpen = false;
        this.render();
        return;
      }
      if (action === "go-today") {
        const today = formatISO(/* @__PURE__ */ new Date());
        this.state.date = today;
        this.state.tab = "today";
        this.state.habitId = null;
        this.state.backupOpen = false;
        await this.refresh();
        return;
      }
      if (action === "open-backup") {
        this.state.backupOpen = true;
        this.state.habitId = null;
        this.state.menuOpen = false;
        this.render();
        return;
      }
      if (action === "back") {
        this.state.backupOpen = false;
        this.state.habitId = null;
        this.render();
        return;
      }
      if (action === "set-date" && target.dataset.date) {
        this.state.date = target.dataset.date;
        await this.refresh();
        return;
      }
      if (action === "open-habit" && target.dataset.id) {
        this.openHabit(target.dataset.id);
        return;
      }
      if (action === "cycle" && target.dataset.id && target.dataset.status) {
        await this.cycle(target.dataset.id, target.dataset.date || this.state.date, target.dataset.status);
        return;
      }
      if (action === "adjust" && target.dataset.id) {
        await this.adjust(target.dataset.id, target.dataset.date || this.state.date, Number(target.dataset.delta) || 0);
        return;
      }
      if (action === "detail-tab" && isDetailTab(target.dataset.tab)) {
        this.state.detailTab = target.dataset.tab;
        this.render();
        return;
      }
      if (action === "select-day" && target.dataset.date) {
        this.state.selectedDay = target.dataset.date;
        this.render();
        return;
      }
      if (action === "shift-month") {
        this.shiftMonth(Number(target.dataset.delta));
        return;
      }
      if (action === "vacation-week" && target.dataset.date) {
        await this.markWeekOff(target.dataset.date);
        return;
      }
      if (action === "save-note") {
        await this.saveNote();
        return;
      }
      if (action === "save-reminder") {
        await this.saveReminder();
        return;
      }
      if (action === "download-backup") await this.downloadBackup();
    }
    async refresh() {
      try {
        const todayItems = await this.api(`/api/today?date=${this.state.date}`);
        const stats = await this.api("/api/statistics");
        const settings = await this.api("/api/settings");
        let detail = null;
        let habitStats = null;
        let reminder = null;
        if (this.state.habitId) {
          [detail, habitStats, reminder] = await Promise.all([
            this.api(`/api/habits/${this.state.habitId}/month?month=${this.state.month}`),
            this.api(`/api/habits/${this.state.habitId}/statistics`),
            this.api(`/api/habits/${this.state.habitId}/reminders`)
          ]);
        }
        this.state.todayItems = todayItems;
        this.state.stats = stats;
        this.state.settings = settings;
        this.state.detail = detail;
        this.state.habitStats = habitStats;
        this.state.reminder = reminder;
        this.state.error = "";
      } catch {
        this.state.error = "The server could not load this screen.";
      }
      this.render();
    }
    async api(path, options = {}) {
      const response = await fetch(path, options);
      const text = await response.text();
      if (!response.ok) throw new Error(text || String(response.status));
      return text ? JSON.parse(text) : null;
    }
    render() {
      this.applyTheme();
      const onMain = !this.state.backupOpen && !this.state.habitId;
      element("title").textContent = this.title();
      element("back").classList.toggle("hidden", onMain);
      element("menu-button").classList.toggle("hidden", !onMain);
      element("menu").classList.toggle("hidden", !this.state.menuOpen);
      element("fab").classList.toggle("hidden", !(onMain && (this.state.tab === "today" || this.state.tab === "tasks")));
      element("tabbar").classList.toggle("hidden", !onMain);
      element("filter").classList.toggle("text-indigo-600", this.state.hideCompleted);
      const error = element("error");
      error.textContent = this.state.error;
      error.classList.toggle("hidden", !this.state.error);
      document.querySelectorAll(".tab-button").forEach((button) => {
        const active = button.dataset.tab === this.state.tab;
        button.className = `tab-button flex flex-col items-center gap-1 ${active ? "font-semibold text-indigo-600 dark:text-indigo-400" : "text-zinc-400"}`;
      });
      const view = element("view");
      if (this.state.backupOpen) return renderBackup(this, view);
      if (this.state.habitId) return renderDetail(this, view);
      if (this.state.tab === "habits") return renderHabits(this, view);
      if (this.state.tab === "tasks") return renderTasks(this, view);
      if (this.state.tab === "statistics") return renderStatistics(this, view);
      return renderToday(this, view);
    }
    title() {
      if (this.state.backupOpen) return "Backup & Restore";
      if (this.state.habitId) return this.state.detail?.habit.title ?? "Habit";
      const titles = { today: "Today", habits: "Habits", tasks: "Tasks", statistics: "Statistics" };
      return titles[this.state.tab];
    }
    applyTheme() {
      document.documentElement.classList.toggle("dark", this.state.theme === "dark");
      const icon = document.getElementById("theme-icon");
      if (icon) icon.className = this.state.theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }
    showModal(open) {
      const modal = element("modal");
      modal.classList.toggle("hidden", !open);
      modal.classList.toggle("flex", open);
    }
    openHabit(id) {
      this.state.habitId = id;
      this.state.month = this.state.date.slice(0, 7);
      this.state.selectedDay = this.state.date;
      this.state.detailTab = "calendar";
      this.state.menuOpen = false;
      void this.refresh();
    }
    async createHabit() {
      const title = input("new-title").value.trim();
      if (!title) return;
      const selectedType = select("new-type").value;
      const habitType = isHabitType(selectedType) ? selectedType : "boolean";
      const target = Number(input("new-target").value) || 1;
      const unit = input("new-unit").value.trim();
      const isTask = input("new-is-task").checked;
      const scheduleDays = Array.from(document.querySelectorAll(".schedule-day:checked")).map((box) => Number(box.value)).filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
      try {
        await this.api("/api/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            habit_type: habitType,
            target_value: target,
            unit: unit || null,
            is_task: isTask,
            schedule_days: scheduleDays.length ? scheduleDays : [0, 1, 2, 3, 4, 5, 6],
            icon_name: isTask ? "list-check" : ICONS[habitType],
            color_hex: isTask ? "#3B82F6" : COLORS[habitType]
          })
        });
        input("new-title").value = "";
        input("new-unit").value = "";
        this.showModal(false);
        await this.refresh();
      } catch {
        this.state.error = "The habit could not be saved.";
        this.render();
      }
    }
    async adjust(id, date, delta) {
      const item = this.state.todayItems.find((entry) => entry.habit.id === id);
      if (!item || delta === 0) return;
      const target = item.habit.target_value || 1;
      const next = Math.min(target, Math.max(0, item.current_value + delta));
      const status = next >= target ? "completed" : next > 0 ? "in_progress" : "pending";
      await this.setStatus(id, date, status, next, null);
    }
    async cycle(id, date, status) {
      const next = nextStatus(status);
      const habit = this.findHabit(id);
      const value = next === "completed" ? habit?.target_value || 1 : 0;
      await this.setStatus(id, date, next, value, null);
    }
    async setStatus(id, date, status, value, note) {
      try {
        await this.api(`/api/habits/${id}/status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, status, value, note })
        });
        await this.refresh();
      } catch {
        this.state.error = "The status could not be saved.";
        this.render();
      }
    }
    async markWeekOff(date) {
      if (!this.state.habitId) return;
      const start = parseISO(date);
      const mondayOffset = (start.getDay() + 6) % 7;
      start.setDate(start.getDate() - mondayOffset);
      try {
        for (let index = 0; index < 7; index += 1) {
          const day = new Date(start);
          day.setDate(start.getDate() + index);
          await this.api(`/api/habits/${this.state.habitId}/status`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: formatISO(day), status: "skipped", value: 0 })
          });
        }
        await this.refresh();
      } catch {
        this.state.error = "The vacation week could not be saved.";
        this.render();
      }
    }
    async saveReminder() {
      if (!this.state.habitId) return;
      const enabled = document.getElementById("reminder-enabled");
      const time = document.getElementById("reminder-time");
      if (!(enabled instanceof HTMLInputElement) || !(time instanceof HTMLInputElement)) return;
      try {
        await this.api(`/api/habits/${this.state.habitId}/reminders`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: enabled.checked, remind_at: time.value || "09:00" })
        });
        await this.refresh();
      } catch {
        this.state.error = "The reminder could not be saved.";
        this.render();
      }
    }
    async saveSettings(dailyBackup) {
      try {
        await this.api("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ daily_backup: dailyBackup })
        });
        await this.refresh();
      } catch {
        this.state.error = "The backup setting could not be saved.";
        this.render();
      }
    }
    async saveNote() {
      const noteInput = document.getElementById("day-note");
      const day = this.state.detail?.days.find((item) => item.date === this.state.selectedDay);
      if (!(noteInput instanceof HTMLInputElement) || !day || !this.state.habitId) return;
      await this.setStatus(this.state.habitId, day.date, day.status, day.value, noteInput.value.trim());
    }
    shiftMonth(delta) {
      const [year, month] = this.state.month.split("-").map(Number);
      const next = new Date(year, month - 1 + delta, 1);
      this.state.month = formatISO(next).slice(0, 7);
      this.state.selectedDay = formatISO(next);
      void this.refresh();
    }
    async downloadBackup() {
      const snapshot = await this.api("/api/backup");
      const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "habitgrip-backup.json";
      link.click();
      URL.revokeObjectURL(link.href);
    }
    async restoreFile(file) {
      try {
        const snapshot = JSON.parse(await file.text());
        if (!isSnapshot(snapshot)) throw new Error("Invalid backup");
        await this.api("/api/backup/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(snapshot)
        });
        await this.refresh();
      } catch {
        this.state.error = "That backup file could not be restored.";
        this.render();
      }
    }
    findHabit(id) {
      return this.state.todayItems.find((item) => item.habit.id === id)?.habit ?? (this.state.detail?.habit.id === id ? this.state.detail.habit : null);
    }
    card(dto, date) {
      const habit = dto.habit;
      const color = /^#[0-9a-fA-F]{3,8}$/.test(habit.color_hex) ? habit.color_hex : "#6366f1";
      const icon = /^[a-z0-9-]+$/i.test(habit.icon_name) ? habit.icon_name : "check";
      const cycleButton = `
        <button type="button" data-action="cycle" data-id="${esc(habit.id)}" data-date="${esc(date)}" data-status="${esc(dto.today_status)}" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${statusClass(dto.today_status)}" aria-label="Change status">
          ${statusIcon(dto.today_status)}
        </button>`;
      const step = habit.habit_type === "duration" ? 10 : 1;
      const controls = habit.habit_type === "boolean" || habit.is_task ? cycleButton : `<div class="flex shrink-0 items-center gap-1">
          <button type="button" data-action="adjust" data-id="${esc(habit.id)}" data-date="${esc(date)}" data-delta="${-step}" class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 dark:border-zinc-700" aria-label="Decrease">\u2212</button>
          <button type="button" data-action="adjust" data-id="${esc(habit.id)}" data-date="${esc(date)}" data-delta="${step}" class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 dark:border-zinc-700" aria-label="Increase">+</button>
          ${cycleButton}
        </div>`;
      return `
      <article data-action="open-habit" data-id="${esc(habit.id)}" class="flex cursor-pointer items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full text-white" style="background:${color}">
            <i class="fa-solid fa-${icon}"></i>
          </div>
          <div>
            <h4 class="text-sm font-medium">${esc(habit.title)}</h4>
            <p class="mt-0.5 text-xs text-zinc-400">${esc(dto.display_progress)}</p>
          </div>
        </div>
        ${controls}
      </article>`;
    }
    statusIcon(status) {
      return statusIcon(status);
    }
    formatISO(date) {
      return formatISO(date);
    }
    parseISO(value) {
      return parseISO(value);
    }
    esc(value) {
      return esc(value);
    }
  };
  function nextStatus(status) {
    if (status === "completed") return "skipped";
    if (status === "skipped") return "pending";
    return "completed";
  }
  function statusClass(status) {
    if (status === "completed") return "border-emerald-500 bg-emerald-500 text-white";
    if (status === "skipped") return "border-zinc-400 bg-zinc-400 text-white";
    if (status === "failed") return "border-rose-400 bg-rose-400 text-white";
    if (status === "in_progress") return "border-sky-400 bg-sky-400 text-white";
    return "border-zinc-300 text-transparent dark:border-zinc-700";
  }
  function statusIcon(status) {
    if (status === "completed") return "\u2713";
    if (status === "skipped") return "\u2013";
    if (status === "failed") return "\xD7";
    if (status === "in_progress") return "\u203A";
    return "";
  }
  function formatISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function parseISO(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char] ?? char);
  }
  function element(id) {
    const found = document.getElementById(id);
    if (!found) throw new Error(`Missing #${id}`);
    return found;
  }
  function input(id) {
    const found = document.getElementById(id);
    if (!(found instanceof HTMLInputElement)) throw new Error(`Missing input #${id}`);
    return found;
  }
  function select(id) {
    const found = document.getElementById(id);
    if (!(found instanceof HTMLSelectElement)) throw new Error(`Missing select #${id}`);
    return found;
  }

  // src/main.ts
  new HabitApp().boot();
})();
