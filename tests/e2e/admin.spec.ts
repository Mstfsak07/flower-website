import { expect, test } from "@playwright/test";

test("admin settings exposes visual config", async ({ page }) => {
  await page.goto("/admin/ayarlar");
  await expect(page.getByRole("heading", { name: "Visual Config" })).toBeVisible();
  await expect(page.getByText("enable3DHero")).toBeVisible();
});
