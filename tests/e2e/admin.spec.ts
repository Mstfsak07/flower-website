import { expect, test } from "@playwright/test";

test("admin settings exposes visual config", async ({ page }) => {
  await page.goto("/giris?redirect=/admin/ayarlar");
  await page.getByPlaceholder("E-posta").fill("admin@lunacicek.test");
  await page.getByPlaceholder("Sifre").fill("Admin123!");
  await page.getByRole("button", { name: "Giris Yap" }).click();

  await expect(page).toHaveURL(/\/admin\/ayarlar/);
  await expect(page.getByRole("heading", { name: "Visual Config" })).toBeVisible();
  await expect(page.getByText("enable3DHero")).toBeVisible();
});
