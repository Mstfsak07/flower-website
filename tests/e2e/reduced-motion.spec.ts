import { expect, test } from "@playwright/test";

test("homepage remains usable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "RIVA ÇİÇEKÇİLİK" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kesfet" })).toBeVisible();
});
