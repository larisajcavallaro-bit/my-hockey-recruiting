import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/My Hockey Recruiting|Hockey/i);
  });

  test("has visible header/navigation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /sign in|log in/i })).toBeVisible({ timeout: 10000 });
  });

  test("links to contact page", async ({ page }) => {
    await page.goto("/");
    const contactLink = page.getByRole("link", { name: /contact/i }).first();
    await expect(contactLink).toBeVisible({ timeout: 10000 });
  });
});
