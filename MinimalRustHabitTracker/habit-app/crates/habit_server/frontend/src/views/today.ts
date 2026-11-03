import type { HabitApp } from "../app";

export function renderToday(app: HabitApp, root: HTMLElement): void {
  const selected = app.parseISO(app.state.date);
  const days: Date[] = [];
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
    const days = item.habit.schedule_days;
    return !Array.isArray(days) || days.length === 0 || days.includes(weekday);
  });
  const cards = items.length
    ? items.map((item) => app.card(item, app.state.date)).join("")
    : `<p class="py-16 text-center text-sm text-zinc-400">Nothing for this day. Use + to add a habit or task.</p>`;

  root.innerHTML = `
    <div class="mb-4 flex justify-between rounded-2xl border border-zinc-200 bg-white p-2 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">${strip}</div>
    <div class="space-y-3">${cards}</div>`;
}
