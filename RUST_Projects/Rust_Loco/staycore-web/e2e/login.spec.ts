import { expect, test } from "@playwright/test";

test("login screen is ready to sign in", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "StayCore" })).toBeVisible();
  await expect(page.getByText("Sign in to browse and book stays")).toBeVisible();
  await expect(page.getByPlaceholder("Email")).toHaveValue("host@test.com");
  await expect(page.getByPlaceholder("Password")).toHaveValue("Password123!");
  await expect(page.getByRole("button", { name: "Log in" })).toBeEnabled();
});

test("a rejected login stays on the sign-in form", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Password").fill("wrong-password");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Invalid credentials or Loco server offline.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});
