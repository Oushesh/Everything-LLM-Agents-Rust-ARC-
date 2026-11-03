import type { HabitCard } from "../types";
import type { HabitApp } from "../app";

export function renderHabits(app: HabitApp, root: HTMLElement): void {
  const habits = app.state.todayItems.filter((item) => !item.habit.is_task);
  if (!habits.length) {
    root.innerHTML = `<p class="py-16 text-center text-sm text-zinc-400">Recurring habits show a six-month grid here.</p>`;
    return;
  }
  root.innerHTML = `<div class="space-y-4">${habits.map((item) => habitGrid(app, item)).join("")}</div>`;
}

function habitGrid(app: HabitApp, dto: HabitCard): string {
  const habit = dto.habit;
  const color = /^#[0-9a-fA-F]{3,8}$/.test(habit.color_hex) ? habit.color_hex : "#6366f1";
  const icon = /^[a-z0-9-]+$/i.test(habit.icon_name) ? habit.icon_name : "check";
  const points = dto.heatmap_6_months;
  const byDate = new Map(points);
  const first = points.length ? app.parseISO(points[0][0]) : new Date();
  const last = points.length ? app.parseISO(points[points.length - 1][0]) : first;
  const cursor = new Date(first);
  cursor.setDate(cursor.getDate() - ((cursor.getDay() + 6) % 7));

  const columns: string[] = [];
  while (cursor <= last) {
    const cells: string[] = [];
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

function heatColor(intensity: number | null | undefined, color: string): string {
  if (intensity == null) return "rgba(113,113,122,0.18)";
  if (intensity >= 0.9) return color;
  if (intensity >= 0.4) return `${color}88`;
  if (intensity > 0) return "#94a3b8";
  return "rgba(113,113,122,0.18)";
}
