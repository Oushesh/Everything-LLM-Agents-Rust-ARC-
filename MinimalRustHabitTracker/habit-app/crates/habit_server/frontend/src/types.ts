export type Theme = "light" | "dark";
export type Tab = "today" | "habits" | "tasks" | "statistics";
export type DetailTab = "overview" | "calendar" | "statistics" | "reminders";
export type HabitType = "boolean" | "numeric" | "duration";
export type LogStatus = "completed" | "failed" | "skipped" | "in_progress" | "pending";

export interface Habit {
  id: string;
  title: string;
  habit_type: string;
  target_value: number;
  unit: string | null;
  icon_name: string;
  color_hex: string;
  is_task: boolean;
  created_at: string;
}

export interface HabitCard {
  habit: Habit;
  current_streak: number;
  best_streak: number;
  today_status: LogStatus;
  current_value: number;
  display_progress: string;
  heatmap_6_months: Array<[string, number]>;
}

export interface GlobalStats {
  active_habits_count: number;
  scheduled_this_week: number;
  scheduled_this_month: number;
  current_streak: number;
  best_streak: number;
  completions_week: number;
  completions_month: number;
  completions_year: number;
  completions_all_time: number;
}

export interface HabitDay {
  date: string;
  status: LogStatus;
  value: number;
  has_note: boolean;
}

export interface HabitMonth {
  habit: Habit;
  current_streak: number;
  best_streak: number;
  days: HabitDay[];
}

export interface BackupLog {
  id: string;
  habit_id: string;
  date: string;
  value: number;
  status: string;
  note: string | null;
}

export interface BackupSnapshot {
  habits: Habit[];
  logs: BackupLog[];
}

export interface AppState {
  theme: Theme;
  tab: Tab;
  date: string;
  habitId: string | null;
  detailTab: DetailTab;
  month: string;
  selectedDay: string;
  hideCompleted: boolean;
  menuOpen: boolean;
  backupOpen: boolean;
  todayItems: HabitCard[];
  stats: GlobalStats | null;
  habitStats: HabitStats | null;
  reminder: HabitReminder | null;
  settings: AppSettings | null;
  detail: HabitMonth | null;
  error: string;
}

export interface HabitStats {
  habit_id: string;
  current_streak: number;
  best_streak: number;
  completions_week: number;
  completions_month: number;
  completions_year: number;
  completions_all_time: number;
}

export interface HabitReminder {
  habit_id: string;
  enabled: boolean;
  remind_at: string;
}

export interface AppSettings {
  daily_backup: boolean;
}

export function isTab(value: string | undefined): value is Tab {
  return value === "today" || value === "habits" || value === "tasks" || value === "statistics";
}

export function isDetailTab(value: string | undefined): value is DetailTab {
  return value === "overview" || value === "calendar" || value === "statistics" || value === "reminders";
}

export function isHabitType(value: string): value is HabitType {
  return value === "boolean" || value === "numeric" || value === "duration";
}

export function isSnapshot(value: unknown): value is BackupSnapshot {
  if (!value || typeof value !== "object") return false;
  const record = value as { habits?: unknown; logs?: unknown };
  return Array.isArray(record.habits) && Array.isArray(record.logs);
}
