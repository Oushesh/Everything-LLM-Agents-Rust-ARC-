import type { HabitApp } from "../app";
import type { HabitMonth, LogStatus } from "../types";

export function renderDetail(app: HabitApp, root: HTMLElement): void {
  const detail = app.state.detail;
  if (!detail) {
    root.innerHTML = `<p class="py-16 text-center text-sm text-zinc-400">Loading this habit.</p>`;
    return;
  }
  const tabs = (["overview", "calendar", "statistics", "reminders"] as const).map((tab) => {
    const active = tab === app.state.detailTab;
    return `<button type="button" data-action="detail-tab" data-tab="${tab}" class="rounded-full px-3 py-1 text-sm capitalize ${active ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-500"}">${tab}</button>`;
  }).join("");
  const bodies = {
    overview: detailOverview(app, detail),
    calendar: detailCalendar(app, detail),
    statistics: detailStats(app),
    reminders: detailNotes(app, detail),
  };
  root.innerHTML = `<div class="mb-4 flex gap-1 overflow-x-auto">${tabs}</div>${bodies[app.state.detailTab]}`;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function scheduleLabel(days: number[] | undefined): string {
  if (!Array.isArray(days) || days.length === 0 || days.length === 7) return "Every day";
  return days.map((day) => WEEKDAYS[day] ?? "").filter(Boolean).join(" · ");
}

function detailOverview(app: HabitApp, detail: HabitMonth): string {
  const day = detail.days.find((item) => item.date === app.state.selectedDay) ?? detail.days[0];
  if (!day) return `<p class="py-16 text-center text-sm text-zinc-400">This month has no days.</p>`;
  return `
    <section class="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p class="text-xs uppercase text-zinc-400">${app.esc(detail.habit.habit_type)} · target ${detail.habit.target_value}${detail.habit.unit ? ` ${app.esc(detail.habit.unit)}` : ""}</p>
      <p class="text-sm text-zinc-500">${app.esc(scheduleLabel(detail.habit.schedule_days))}</p>
      <p class="text-sm">${app.esc(day.date)} is ${app.esc(day.status.replace(/_/g, " "))}</p>
      ${day.note ? `<p class="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">${app.esc(day.note)}</p>` : ""}
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"><div class="text-2xl font-bold text-indigo-500">${detail.current_streak}</div><p class="text-xs text-zinc-400">Current streak</p></div>
        <div class="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50"><div class="text-2xl font-bold text-indigo-500">${detail.best_streak}</div><p class="text-xs text-zinc-400">Best streak</p></div>
      </div>
    </section>`;
}

function detailCalendar(app: HabitApp, detail: HabitMonth): string {
  const [year, month] = app.state.month.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const leading = (first.getDay() + 6) % 7;
  const cells = Array.from({ length: leading }, () => `<span></span>`);
  const skipped = detail.days.some((day) => day.status === "skipped");
  for (const day of detail.days) {
    const selected = day.date === app.state.selectedDay;
    const date = app.parseISO(day.date);
    cells.push(`
      <button type="button" data-action="select-day" data-date="${day.date}" class="flex aspect-square flex-col items-center justify-center rounded-xl text-xs ${dayClass(day.status)} ${selected ? "ring-2 ring-indigo-500" : ""}">
        <span>${date.getDate()}</span>
        <span>${app.statusIcon(day.status) || (day.has_note ? "•" : "")}</span>
      </button>`);
  }
  const selected = detail.days.find((day) => day.date === app.state.selectedDay) ?? detail.days[0];
  if (!selected) return `<p class="py-16 text-center text-sm text-zinc-400">This month has no days.</p>`;
  return `
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <button type="button" data-action="shift-month" data-delta="-1" class="h-9 w-9 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Previous month">‹</button>
        <h3 class="font-semibold">${label}</h3>
        <button type="button" data-action="shift-month" data-delta="1" class="h-9 w-9 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Next month">›</button>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-[10px] uppercase text-zinc-400"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      <div class="grid grid-cols-7 gap-1">${cells.join("")}</div>
      <div class="flex flex-wrap gap-2">
        ${skipped ? `<span class="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">On vacation</span>` : ""}
        ${detail.current_streak > 0 ? `<span class="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Streak kept</span>` : ""}
      </div>
      <button type="button" data-action="vacation-week" data-date="${selected.date}" class="w-full rounded-xl border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-600">Mark the week of ${selected.date} as vacation</button>
      <div>
        <p class="mb-2 text-xs font-medium text-zinc-500">Set ${selected.date} to</p>
        <div class="flex flex-wrap gap-1.5">
          ${(["completed", "failed", "skipped", "in_progress", "pending"] as LogStatus[]).map((status) => `
            <button type="button" data-action="set-status" data-status="${status}" class="rounded-full px-3 py-1.5 text-xs font-medium ${status === selected.status ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"}">${app.statusIcon(status)} ${status.replace(/_/g, " ")}</button>`).join("")}
        </div>
      </div>
      ${selected.note ? `<p class="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-300">${app.esc(selected.note)}</p>` : ""}
      <div class="grid grid-cols-2 gap-2 text-xs text-zinc-500">
        <span>✓ Completed</span><span>× Failed</span><span>– Skipped</span><span>› In progress</span><span>○ Pending</span><span>• Has note</span>
      </div>
    </section>`;
}

function dayClass(status: LogStatus): string {
  if (status === "completed") return "bg-emerald-100 text-emerald-700";
  if (status === "failed") return "bg-rose-100 text-rose-600";
  if (status === "skipped") return "bg-zinc-200 text-zinc-500 dark:bg-zinc-800";
  if (status === "in_progress") return "bg-sky-100 text-sky-700";
  return "bg-white text-zinc-600 dark:bg-zinc-900";
}

function detailStats(app: HabitApp): string {
  const stats = app.state.habitStats;
  if (!stats) return `<p class="py-16 text-center text-sm text-zinc-400">Statistics are still loading.</p>`;
  const tile = (value: number, label: string) => `
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

function detailNotes(app: HabitApp, detail: HabitMonth): string {
  const selected = detail.days.find((day) => day.date === app.state.selectedDay) ?? detail.days[0];
  if (!selected) return `<p class="py-16 text-center text-sm text-zinc-400">This month has no days.</p>`;
  const reminder = app.state.reminder;
  const notes = detail.days.filter((day) => day.has_note).map((day) => `<li><span class="text-zinc-400">${app.esc(day.date)}</span> ${app.esc(day.note ?? "")}</li>`).join("");
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
      <input id="day-note" type="text" placeholder="Write a note" value="${app.esc(selected.note ?? "")}" class="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800">
      <button type="button" data-action="save-note" class="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">Save note</button>
      <ul class="list-disc pl-5 text-sm text-zinc-500">${notes || "<li>No notes this month.</li>"}</ul>
    </section>`;
}
