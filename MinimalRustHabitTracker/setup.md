## Idea: How do add Agent Testing my code:

   https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1

## Rust:

   how do add it to rust?
   https://dev.to/debs_obrien/letting-playwright-mcp-explore-your-site-and-write-your-tests-mf1

## Solution 01: Playwright MCP (@playwright/MCP) -> operates strictly over HTTP/Websocket.

   So its decoupled completely from the Backend language whether rust or next.js or any python backend like Django or FastApI

   The architecture for this is as follows:   
   ![](../screenshots_images/PlaywrightMCPArchitecture.png)

   Playwright MCP --> Communicates with the Browser --> 
   Step 1: Register Playwright MCP in your Agent Client

   npx @playwright/mcp@latest .

   Option A: Claude Code CLI

## Option B: Claude Code CLI

   Cursor/VS Code Client 
   usually mcp.json
   In your MCP configuration file (~/.cursor/mcp.json or .vscode/mcp.json):

```
    json
    {
    "mcpServers": {
    "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest", "--isolated", "--headless"]
    }
    }
    }
```

## Rust Server:

   Terminal 1: Run your Rust Backend
   cargo run -p ...

   Terminal 2: Run the spec auditor 

```
```
bash: 
claude "Use the playwright MCP server to navigate to http://localhost:3000.
Read ./docs/SPEC.md. Verify that:
1. The dashboard navigation matches the routes defined in the spec.
2. Clicking 'New Habit' opens a modal with title and frequency fields.
3. Form submission sends a POST to /api/habits with correct payload.
   Report any UI defects, console errors, or spec mismatches."
   ```

Step 3: Integrating into "cargo test" /Makefile/Justfile
dev: 
   # Makefile
    cargo run & PID=$$!; \
    sleep 2; \
    claude -p "Use playwright MCP to audit http://localhost:3000 against ./docs/frontend_spec.md. Output summary to audit-report.json."; \
    kill $$PID
```

## Agentic Testing:

   How would I setup this testing? 

   Easy Setup: The 2 Agent Handoff described is the right shape: 

1. Tester Agent (tests only, doesn't touch app code): runs playwright, produces a report -- failin test name, steps to reproduce, expected vs actual, a secreenshot and trace file for each failure, and the browser console/server errors.
2. You read the summary at a high level and hand the report to the fixer agent.
3. Fixer agent changes the app, and the tester re-runs to prove it.

## HabitGrip: concrete Playwright setup for this repo

Playwright does not care that the backend is Rust. It drives a real browser
against the page the Rust server serves, so the split is:

- Rust backend: `cargo test` + `habit-app/scripts/smoke-test.sh` (API-level dumb tester).
- Frontend: Playwright tests clicking the real UI at http://127.0.0.1:8080.

### 1. Install (one time)

Run from `habit-app/crates/habit_server/frontend`:

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 2. Configure `playwright.config.ts`

Put this next to `package.json` in `habit-app/crates/habit_server/frontend`.
It starts the Rust server against a throwaway database so tests never touch
the real `habit-app/habits.sqlite`, and it keeps proof for every failure:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: "http://127.0.0.1:8080",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "../../scripts/test-server.sh",
    url: "http://127.0.0.1:8080/api/health",
    reuseExistingServer: false,
  },
});
```

`test-server.sh` should start `target/debug/habit_server` from a temporary
folder (the server creates `habits.sqlite` in its working folder and serves
on the fixed port 8080), the same trick `smoke-test.sh` already uses. Port
8080 must be free, so stop the normal `cargo run` before the test run.

### 3. Write specs per screenshot (`e2e/*.spec.ts`)

One spec file per screen (Today, habit detail/calendar, Statistics, Backup).
Specs read like the manual test bullets, e.g.:

```ts
import { test, expect } from "@playwright/test";

test("counter habit counts up to its target", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add habit" }).click();
  await page.getByPlaceholder("Title").fill("Drink Water");
  // choose Counter, target 8, unit glasses, Save
  await expect(page.getByText("Drink Water")).toBeVisible();
  await page.getByRole("button", { name: "Increase" }).click();
  await expect(page.getByText("1/8 glasses")).toBeVisible();
});
```

A test like this would have caught the stuck Save dialog immediately:
click Save, expect the dialog to close, fail with a screenshot when it does not.

Combinations come from parameterising one spec body instead of writing each
case by hand: habit type (boolean / counter / timer) x repeat pattern
(every day, Mon-Wed-Fri, weekend) x status (completed, failed, skipped,
in_progress, pending) x theme (light, dark). Playwright runs the matrix.

### 4. Run it

From `habit-app/crates/habit_server/frontend`:

```bash
npx playwright test          # run the whole suite
npx playwright show-report   # open the HTML report (screenshots, traces, video)
```

The report is the handoff artifact: failing test name, the step that failed,
expected vs actual, screenshot and trace for each failure.

### 5. The two-agent loop

- Tester agent prompt (it may write tests and the report, never app code):

  "Use Playwright MCP to explore the app at http://127.0.0.1:8080. You may
  write files only under e2e/ and a report at e2e/REPORT.md. Do not change
  app code. For each problem: what you clicked or ran, what you expected,
  what happened, and the screenshot/trace path."
- You: skim `e2e/REPORT.md` at a high level.
- Fixer agent prompt: "Fix the problems in e2e/REPORT.md. Do not edit the
tests." Then the tester re-runs to prove the fix.

Keep the rule strict: the tester never edits app code and the fixer never
edits tests, otherwise a failure gets "fixed" by weakening the test.

### Day-to-day checklist

1. `cd habit-app && cargo test -p habit_core -p habit_server`
2. `./scripts/smoke-test.sh` (server stopped, port 8080 free)
3. `cd crates/habit_server/frontend && npx playwright test`
4. Read the report, hand failures to the fixer, re-run until green.
