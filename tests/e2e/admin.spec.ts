import { expect, test } from "@playwright/test";

test("admin settings exposes visual config", async ({ page }) => {
  const loginResponse = await page.request.post("/api/auth/login", {
    data: {
      email: "admin@rivacicekantalya.test",
      password: "Admin123!",
      redirectTo: "/admin/ayarlar",
    },
  });

  expect(loginResponse.ok()).toBeTruthy();

  await page.goto("/admin/ayarlar");
  await expect(page).toHaveURL(/\/admin\/ayarlar(?:\?|$)/);
  await expect(page.getByText("Visual Config").first()).toBeVisible();
  await expect(page.getByText("enable3DHero")).toBeVisible();
});
