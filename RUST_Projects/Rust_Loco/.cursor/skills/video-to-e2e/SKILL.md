---
name: video-to-e2e
description: >-
  Turns a screen recording of the StayCore frontend into a Playwright spec and
  runs it. Use when the user shares a video, screen recording, or clip of the
  UI and wants an end-to-end test, or mentions video-to-test.
---

# Video to end-to-end test

One video is one user journey. Write one spec for that journey, then run it until the new test passes.

Work in `staycore-web`. The app is Next.js on port 3000. Authenticated flows also need Loco on port 5150 (`cargo loco start` in `airbnb_api`).

## Steps

1. Extract frames. From `staycore-web`:

```bash
pnpm frames -- path/to/recording.mp4
```

Frames land in `e2e/.frames/<recording-name>/`. Read them in filename order. They show the sequence and the visible text. They do not contain selectors.

2. Name the journey from the frames (login, search, reserve). Read `src/app/page.tsx` and open the running app if a label is ambiguous. Use the visible text from the frames as the expected copy.

3. Add `e2e/<journey>.spec.ts`. Follow `e2e/login.spec.ts`:

- `getByRole`, `getByPlaceholder`, and `getByText` only
- Assert the result that is visible at the end of the clip
- One `test(...)` per journey unless the clip clearly shows two checks of the same screen

4. Run from `staycore-web`:

```bash
pnpm test:e2e -- e2e/<journey>.spec.ts
```

5. If it fails, fix the spec from the Playwright error and the frames, then run that file again. Stop when it passes. Keep the assertion that matches the clip.

## Servers

`pnpm test:e2e` starts Next if it is down. Start Loco yourself before a clip that signs in or books. A clip that only shows the logged-out form can run without Loco.
