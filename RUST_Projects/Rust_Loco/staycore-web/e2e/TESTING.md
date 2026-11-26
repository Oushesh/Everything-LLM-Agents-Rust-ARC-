# StayCore end-to-end tests

One user journey is one Playwright spec. The browser talks to Next.js on port 3000. Next.js rewrites `/api/*` to the Loco API.

## 1. Start the servers

Loco must be running before any test that signs in or books.

```sh
# terminal 1 — airbnb_api
cargo loco start
```

```sh
# terminal 2 — staycore-web
pnpm dev
```

The API origin defaults to `http://localhost:5150`. Override it by copying `.env.example` and changing `LOCO_API_URL`, then restart `pnpm dev`.

## 2. Run the tests

```sh
pnpm test:e2e
```

Playwright starts Next.js if it is not already up. Specs live in `e2e/` and match `*.spec.ts`.

The login spec checks the signed-out screen and a rejected password:

```ts
import { expect, test } from "@playwright/test";

test("login screen is ready to sign in", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "StayCore" })).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toHaveValue("host@test.com");
  await expect(page.getByRole("button", { name: "Log in" })).toBeEnabled();
});

test("a rejected login stays on the sign-in form", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(
    page.getByText("Invalid credentials or Loco server offline.")
  ).toBeVisible();
});
```

Use `getByRole`, `getByPlaceholder`, and `getByText`. Run one file while you are writing it:

```sh
pnpm test:e2e -- e2e/login.spec.ts
```

## 3. Record a test by clicking

Use this when you are at the keyboard and want Playwright to write the file.

```sh
pnpm test:e2e:codegen
```

A browser opens on `http://localhost:3000`. Log in, search, or reserve. Close the inspector. The clicks are saved to `e2e/recorded.spec.ts`. Run `pnpm test:e2e` again to replay them.

## 4. Turn a video into a test

Use this when you already have a screen recording of one journey.

```sh
pnpm frames -- path/to/recording.mp4
```

That writes stills to `e2e/.frames/<recording-name>/`. Those frames are gitignored. Then ask the agent to write and run the spec. The agent skill is `.cursor/skills/video-to-e2e/SKILL.md`. It tells the agent to:

1. Read the frames in order and name the journey.
2. Read `src/app/page.tsx` for the real labels.
3. Add `e2e/<journey>.spec.ts` in the same style as `e2e/login.spec.ts`.
4. Run `pnpm test:e2e -- e2e/<journey>.spec.ts` and fix the spec until it passes.

One clip, one spec. A clip that only shows the login form can run without Loco. A clip that signs in or books needs `cargo loco start` first.

## 5. When a test fails

Read the Playwright error, change the spec, and run that file again. Keep the assertion that matches what the screen showed. A wrong password must still expect the error text. A successful reserve must still expect the confirmation.


## 6. Next Step would be to have autonomous testing improvements here.