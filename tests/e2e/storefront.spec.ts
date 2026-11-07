import { expect, test } from "@playwright/test";

test("storefront to cart flow works", async ({ page }) => {
  await page.goto("/magaza");
  await expect(page.getByRole("heading", { name: "RIVA ÇİÇEKÇİLİK" })).toBeVisible();
  await expect(page.locator("article").first()).toBeVisible();

  await page.getByRole("button", { name: "Sepete Ekle" }).first().click();
  await expect(page.getByText("Urun sepete eklendi.").first()).toBeVisible();
  await page.waitForTimeout(300);
  await page.goto("/sepet");
  await expect(page.getByRole("heading", { name: "Alisveris Sepeti" })).toBeVisible();
});
