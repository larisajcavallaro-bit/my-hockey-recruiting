import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test("loads contact form", async ({ page }) => {
    await page.goto("/contact-us");
    await expect(page.getByRole("heading", { name: "Help Center" })).toBeVisible({ timeout: 10000 });
  });

  test("contact form can be filled and submitted", async ({ page }) => {
    await page.goto("/contact-us");

    await page.getByPlaceholder(/enter your first name/i).fill("Test");
    await page.getByPlaceholder(/enter your last name/i).fill("User");
    await page.getByPlaceholder(/email we should reply/i).fill("test@example.com");

    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: /^Other$/i }).click();

    await page.getByPlaceholder(/describe the issue/i).fill("This is an E2E test message.");

    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText(/received|success/i)).toBeVisible({ timeout: 15000 });
  });
});
