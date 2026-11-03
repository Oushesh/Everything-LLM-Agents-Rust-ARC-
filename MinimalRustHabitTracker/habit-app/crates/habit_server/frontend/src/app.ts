import { renderBackup } from "./views/backup";
import { renderDetail } from "./views/detail";
import { renderHabits } from "./views/habits";
import { renderStatistics } from "./views/statistics";
import { renderTasks } from "./views/tasks";
import { renderToday } from "./views/today";
import {
  isDetailTab,
  isHabitType,
  isSnapshot,
  isTab,
  type AppState,
  type BackupSnapshot,
  type AppSettings,
  type GlobalStats,
  type Habit,
  type HabitCard,
  type HabitMonth,
  type HabitReminder,
  type HabitStats,
  type HabitType,
  type LogStatus,
} from "./types";

const ICONS: Record<HabitType, string> = { boolean: "check", numeric: "hashtag", duration: "clock" };
const COLORS: Record<HabitType, string> = { boolean: "#6366F1", numeric: "#10B981", duration: "#8B5CF6" };

export class HabitApp {
  state: AppState;

  constructor() {
    const today = formatISO(new Date());
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
      error: "",
    };
  }

  boot(): void {
    this.applyTheme();
    document.body.addEventListener("click", (event) => this.onClick(event));
    document.body.addEventListener("change", (event) => this.onChange(event));
    void this.refresh();
  }

  onClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>("[data-action]");
    if (!target) {
      if (this.state.menuOpen && !event.target.closest("#menu")) {
        this.state.menuOpen = false;
        this.render();
      }
      return;
    }
    void this.onAction(target);
  }

  onChange(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const file = target.files?.[0];
    if (target.id === "restore-file" && file) void this.restoreFile(file);
    if (target.id === "daily-backup") void this.saveSettings(target.checked);
  }

  async onAction(target: HTMLElement): Promise<void> {
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
      const today = formatISO(new Date());
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

  async refresh(): Promise<void> {
    try {
      const todayItems = await this.api<HabitCard[]>(`/api/today?date=${this.state.date}`);
      const stats = await this.api<GlobalStats>("/api/statistics");
      const settings = await this.api<AppSettings>("/api/settings");
      let detail: HabitMonth | null = null;
      let habitStats: HabitStats | null = null;
      let reminder: HabitReminder | null = null;
      if (this.state.habitId) {
        [detail, habitStats, reminder] = await Promise.all([
          this.api<HabitMonth>(`/api/habits/${this.state.habitId}/month?month=${this.state.month}`),
          this.api<HabitStats>(`/api/habits/${this.state.habitId}/statistics`),
          this.api<HabitReminder>(`/api/habits/${this.state.habitId}/reminders`),
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

  async api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(path, options);
    const text = await response.text();
    if (!response.ok) throw new Error(text || String(response.status));
    return (text ? JSON.parse(text) : null) as T;
  }

  render(): void {
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
    document.querySelectorAll<HTMLElement>(".tab-button").forEach((button) => {
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

  title(): string {
    if (this.state.backupOpen) return "Backup & Restore";
    if (this.state.habitId) return this.state.detail?.habit.title ?? "Habit";
    const titles = { today: "Today", habits: "Habits", tasks: "Tasks", statistics: "Statistics" };
    return titles[this.state.tab];
  }

  applyTheme(): void {
    document.documentElement.classList.toggle("dark", this.state.theme === "dark");
    const icon = document.getElementById("theme-icon");
    if (icon) icon.className = this.state.theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }

  showModal(open: boolean): void {
    const modal = element("modal");
    modal.classList.toggle("hidden", !open);
    modal.classList.toggle("flex", open);
  }

  openHabit(id: string): void {
    this.state.habitId = id;
    this.state.month = this.state.date.slice(0, 7);
    this.state.selectedDay = this.state.date;
    this.state.detailTab = "calendar";
    this.state.menuOpen = false;
    void this.refresh();
  }

  async createHabit(): Promise<void> {
    const title = input("new-title").value.trim();
    if (!title) return;
    const selectedType = select("new-type").value;
    const habitType: HabitType = isHabitType(selectedType) ? selectedType : "boolean";
    const target = Number(input("new-target").value) || 1;
    const unit = input("new-unit").value.trim();
    const isTask = input("new-is-task").checked;
    const scheduleDays = Array.from(document.querySelectorAll<HTMLInputElement>(".schedule-day:checked"))
      .map((box) => Number(box.value))
      .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
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
          color_hex: isTask ? "#3B82F6" : COLORS[habitType],
        }),
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

  async adjust(id: string, date: string, delta: number): Promise<void> {
    const item = this.state.todayItems.find((entry) => entry.habit.id === id);
    if (!item || delta === 0) return;
    const target = item.habit.target_value || 1;
    const next = Math.min(target, Math.max(0, item.current_value + delta));
    const status: LogStatus = next >= target ? "completed" : next > 0 ? "in_progress" : "pending";
    await this.setStatus(id, date, status, next, null);
  }

  async cycle(id: string, date: string, status: string): Promise<void> {
    const next = nextStatus(status);
    const habit = this.findHabit(id);
    const value = next === "completed" ? habit?.target_value || 1 : 0;
    await this.setStatus(id, date, next, value, null);
  }

  async setStatus(id: string, date: string, status: LogStatus, value: number, note: string | null): Promise<void> {
    try {
      await this.api(`/api/habits/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, status, value, note }),
      });
      await this.refresh();
    } catch {
      this.state.error = "The status could not be saved.";
      this.render();
    }
  }

  async markWeekOff(date: string): Promise<void> {
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
          body: JSON.stringify({ date: formatISO(day), status: "skipped", value: 0 }),
        });
      }
      await this.refresh();
    } catch {
      this.state.error = "The vacation week could not be saved.";
      this.render();
    }
  }

  async saveReminder(): Promise<void> {
    if (!this.state.habitId) return;
    const enabled = document.getElementById("reminder-enabled");
    const time = document.getElementById("reminder-time");
    if (!(enabled instanceof HTMLInputElement) || !(time instanceof HTMLInputElement)) return;
    try {
      await this.api(`/api/habits/${this.state.habitId}/reminders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: enabled.checked, remind_at: time.value || "09:00" }),
      });
      await this.refresh();
    } catch {
      this.state.error = "The reminder could not be saved.";
      this.render();
    }
  }

  async saveSettings(dailyBackup: boolean): Promise<void> {
    try {
      await this.api("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ daily_backup: dailyBackup }),
      });
      await this.refresh();
    } catch {
      this.state.error = "The backup setting could not be saved.";
      this.render();
    }
  }

  async saveNote(): Promise<void> {
    const noteInput = document.getElementById("day-note");
    const day = this.state.detail?.days.find((item) => item.date === this.state.selectedDay);
    if (!(noteInput instanceof HTMLInputElement) || !day || !this.state.habitId) return;
    await this.setStatus(this.state.habitId, day.date, day.status, day.value, noteInput.value.trim());
  }

  shiftMonth(delta: number): void {
    const [year, month] = this.state.month.split("-").map(Number);
    const next = new Date(year, month - 1 + delta, 1);
    this.state.month = formatISO(next).slice(0, 7);
    this.state.selectedDay = formatISO(next);
    void this.refresh();
  }

  async downloadBackup(): Promise<void> {
    const snapshot = await this.api<BackupSnapshot>("/api/backup");
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "habitgrip-backup.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async restoreFile(file: File): Promise<void> {
    try {
      const snapshot: unknown = JSON.parse(await file.text());
      if (!isSnapshot(snapshot)) throw new Error("Invalid backup");
      await this.api("/api/backup/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      await this.refresh();
    } catch {
      this.state.error = "That backup file could not be restored.";
      this.render();
    }
  }

  findHabit(id: string): Habit | null {
    return this.state.todayItems.find((item) => item.habit.id === id)?.habit
      ?? (this.state.detail?.habit.id === id ? this.state.detail.habit : null);
  }

  card(dto: HabitCard, date: string): string {
    const habit = dto.habit;
    const color = /^#[0-9a-fA-F]{3,8}$/.test(habit.color_hex) ? habit.color_hex : "#6366f1";
    const icon = /^[a-z0-9-]+$/i.test(habit.icon_name) ? habit.icon_name : "check";
    const cycleButton = `
        <button type="button" data-action="cycle" data-id="${esc(habit.id)}" data-date="${esc(date)}" data-status="${esc(dto.today_status)}" class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${statusClass(dto.today_status)}" aria-label="Change status">
          ${statusIcon(dto.today_status)}
        </button>`;
    const step = habit.habit_type === "duration" ? 10 : 1;
    const controls = habit.habit_type === "boolean" || habit.is_task
      ? cycleButton
      : `<div class="flex shrink-0 items-center gap-1">
          <button type="button" data-action="adjust" data-id="${esc(habit.id)}" data-date="${esc(date)}" data-delta="${-step}" class="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 text-zinc-500 dark:border-zinc-700" aria-label="Decrease">−</button>
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

  statusIcon(status: LogStatus): string {
    return statusIcon(status);
  }

  formatISO(date: Date): string {
    return formatISO(date);
  }

  parseISO(value: string): Date {
    return parseISO(value);
  }

  esc(value: unknown): string {
    return esc(value);
  }
}

function nextStatus(status: string): LogStatus {
  if (status === "completed") return "skipped";
  if (status === "skipped") return "pending";
  return "completed";
}

function statusClass(status: LogStatus): string {
  if (status === "completed") return "border-emerald-500 bg-emerald-500 text-white";
  if (status === "skipped") return "border-zinc-400 bg-zinc-400 text-white";
  if (status === "failed") return "border-rose-400 bg-rose-400 text-white";
  if (status === "in_progress") return "border-sky-400 bg-sky-400 text-white";
  return "border-zinc-300 text-transparent dark:border-zinc-700";
}

function statusIcon(status: LogStatus): string {
  if (status === "completed") return "✓";
  if (status === "skipped") return "–";
  if (status === "failed") return "×";
  if (status === "in_progress") return "›";
  return "";
}

function formatISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseISO(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function esc(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char] ?? char));
}

function element(id: string): HTMLElement {
  const found = document.getElementById(id);
  if (!found) throw new Error(`Missing #${id}`);
  return found;
}

function input(id: string): HTMLInputElement {
  const found = document.getElementById(id);
  if (!(found instanceof HTMLInputElement)) throw new Error(`Missing input #${id}`);
  return found;
}

function select(id: string): HTMLSelectElement {
  const found = document.getElementById(id);
  if (!(found instanceof HTMLSelectElement)) throw new Error(`Missing select #${id}`);
  return found;
}
