import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// AC #6: zero critical/serious axe violations across the four routes.
const routes = ["/", "/events", "/events?tab=past", "/about", "/events/build-with-ai-bootcamp"];

for (const route of routes) {
  test(`${route} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).include("body").analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}

test("mobile drawer supports full keyboard operation", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Open menu" });
  await toggle.click();
  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(toggle).toBeFocused();
});
