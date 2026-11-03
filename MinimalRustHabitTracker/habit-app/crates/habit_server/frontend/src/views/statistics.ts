import type { HabitApp } from "../app";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function yearChart(monthly: number[] | undefined): string {
  const values = Array.from({ length: 12 }, (_, index) => monthly?.[index] ?? 0);
  const max = Math.max(...values, 1);
  const currentMonth = new Date().getMonth();
  const bars = values.map((value, index) => {
    const height = Math.max(4, Math.round((value / max) * 100));
    const bar = index === currentMonth ? "bg-indigo-500" : "bg-indigo-300 dark:bg-indigo-500/50";
    return `
      <div class="flex flex-1 flex-col items-center justify-end gap-1" title="${MONTHS[index]}: ${value}">
        <span class="text-[9px] text-zinc-400">${value || ""}</span>
        <div class="flex h-24 w-full items-end"><div class="w-full rounded-t ${bar}" style="height:${height}%"></div></div>
        <span class="text-[9px] ${index === currentMonth ? "font-semibold text-indigo-500" : "text-zinc-400"}">${MONTHS[index][0]}</span>
      </div>`;
  }).join("");
  return `<div class="mt-3 flex items-end gap-1">${bars}</div>`;
}

export function renderStatistics(app: HabitApp, root: HTMLElement): void {
  const stats = app.state.stats;
  if (!stats) {
    root.innerHTML = `<p class="py-16 text-center text-sm text-zinc-400">Statistics are still loading.</p>`;
    return;
  }
  const tile = (value: number, label: string) => `
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
      <section class="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 class="text-xs font-bold uppercase text-zinc-400">This year</h3>
        ${yearChart(stats.monthly_completions)}
      </section>
    </div>`;
}
