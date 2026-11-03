import type { HabitApp } from "../app";

export function renderTasks(app: HabitApp, root: HTMLElement): void {
  const tasks = app.state.todayItems.filter((item) => item.habit.is_task);
  const visible = tasks.filter((item) => !(app.state.hideCompleted && item.today_status === "completed"));
  const cards = visible.length
    ? visible.map((item) => app.card(item, app.state.date)).join("")
    : `<p class="py-16 text-center text-sm text-zinc-400">No tasks for this day.</p>`;
  root.innerHTML = `<div class="space-y-3">${cards}</div>`;
}
