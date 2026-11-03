import type { HabitApp } from "../app";

export function renderBackup(app: HabitApp, root: HTMLElement): void {
  const daily = app.state.settings?.daily_backup ?? false;
  const stored = app.state.storedBackups.map((backup) => `
    <div class="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <span>
        <span class="block text-sm font-medium">${app.esc(backup.name.replace(/^backup-|\.json$/g, ""))}</span>
        <span class="text-xs text-zinc-400">${Math.max(1, Math.round(backup.size_bytes / 1024))} KB · on this server</span>
      </span>
      <button type="button" data-action="restore-server-backup" data-name="${app.esc(backup.name)}" class="rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">Restore</button>
    </div>`).join("");
  root.innerHTML = `
    <div class="space-y-4">
      <p class="rounded-2xl bg-indigo-50 p-4 text-sm text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100">
        Backups now include your habits, tasks, logs, reminders, and the daily-backup setting. Nothing is uploaded anywhere.
      </p>
      <button type="button" data-action="download-backup" class="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Create Backup</span><span class="text-xs text-zinc-400">Download a new checkpoint as a file</span></span>
        <i class="fa-solid fa-chevron-right text-zinc-400"></i>
      </button>
      <label class="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Restore from Backup</span><span class="text-xs text-zinc-400">Choose a JSON file from this app</span></span>
        <input id="restore-file" type="file" accept="application/json,.json" class="hidden">
        <i class="fa-solid fa-chevron-right text-zinc-400"></i>
      </label>
      <button type="button" data-action="create-server-backup" class="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Save backup on this server</span><span class="text-xs text-zinc-400">Kept in the backups folder, newest 30</span></span>
        <i class="fa-solid fa-server text-zinc-400"></i>
      </button>
      <div class="space-y-2">
        <h3 class="text-xs font-bold uppercase text-zinc-400">Backups on this server</h3>
        ${stored || `<p class="text-sm text-zinc-400">None yet. Save one above, or turn on daily backups.</p>`}
      </div>
      <label class="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        <span><span class="block font-medium">Daily auto backups</span><span class="text-xs text-zinc-400">One backup a day is written the first time this screen loads that day</span></span>
        <input id="daily-backup" type="checkbox" ${daily ? "checked" : ""}>
      </label>
    </div>`;
}
