export function renderBackup(root: HTMLElement): void {
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
    </div>`;
}
