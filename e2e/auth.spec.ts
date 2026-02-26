import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("sign-in page loads", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByRole("heading", { name: /welcome back|sign in/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test("sign-up page loads", async ({ page }) => {
    await page.goto("/auth/sign-up");
    await expect(page.getByRole("heading", { name: /create.*account/i })).toBeVisible({ timeout: 10000 });
  });

  test("unauthenticated user redirected from coach dashboard", async ({ page }) => {
    await page.goto("/coach-dashboard");
    await expect(page).toHaveURL(/auth\/sign-in/);
  });

  test("unauthenticated user redirected from parent dashboard", async ({ page }) => {
    await page.goto("/parent-dashboard");
    await expect(page).toHaveURL(/auth\/sign-in/);
  });
});
