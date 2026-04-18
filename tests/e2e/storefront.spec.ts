import { expect, test } from "@playwright/test";

test("storefront to cart flow works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Yeni Koleksiyon")).toBeVisible();

  await page.getByRole("link", { name: "Koleksiyonu Kesfet" }).first().click();
  await expect(page).toHaveURL(/kategori/);

  await page.getByRole("link", { name: "Incele" }).first().click();
  await expect(page).toHaveURL(/urun/);

  await page.getByRole("button", { name: "Sepete Ekle" }).click();
  await expect(page.getByText("Urun sepete eklendi.").first()).toBeVisible();
  await page.waitForTimeout(300);
  await page.goto("/sepet");
  await expect(page.getByRole("heading", { name: "Sepetin Hazir" })).toBeVisible();
});
