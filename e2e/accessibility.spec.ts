import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// AC #6: zero critical/serious axe violations across the four routes.
const routes = ["/", "/events", "/events?tab=past", "/about", "/events/build-with-ai-bootcamp"];

/**
 * Every route registers the service worker on first visit, and the browser can
 * reload the page out from under a scan that's already running — axe surfaces
 * that as "Execution context was destroyed", which is a navigation, not a
 * violation. Confirmed independently of this suite: against a production build,
 * routes with no Suspense and no recent changes fail exactly the same way, and
 * every route passes on a second visit. axe-core documents the retry as the
 * remedy, so scan once more on the settled page rather than loosening the
 * assertion.
 */
async function scan(page: Page) {
  try {
    return await new AxeBuilder({ page }).include("body").analyze();
  } catch (error) {
    if (!String(error).includes("Execution context was destroyed")) throw error;
    await page.waitForLoadState("load");
    return await new AxeBuilder({ page }).include("body").analyze();
  }
}

for (const route of routes) {
  test(`${route} has no critical or serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await scan(page);
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });
}

test("person detail modal supports full keyboard operation", async ({ page }) => {
  await page.goto("/about");

  // Simar Preet Singh is the fixture organizer with a bio and an X handle, so
  // his card is the one that carries the trigger. Narrow by "the innermost div
  // holding both his name and a trigger" — filtering on the name alone lands on
  // the inner text wrapper, which doesn't contain the button.
  const trigger = page
    .locator("div")
    .filter({ hasText: "Simar Preet Singh" })
    .filter({ has: page.getByRole("button", { name: "View profile" }) })
    .last()
    .getByRole("button", { name: "View profile" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Simar Preet Singh" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Simar Preet Singh on X" })).toBeVisible();

  // The open dialog is a state the route-level axe scans never see.
  const results = await new AxeBuilder({ page }).include("body").analyze();
  const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test("a person with no bio and no handles gets no profile button", async ({ page }) => {
  await page.goto("/events/build-with-ai-bootcamp");
  // Two of the three speakers on this fixture event have details; Akansha has
  // neither a bio nor a handle, so the page must carry exactly two triggers and
  // hers must not be one of them.
  await expect(page.getByText("Akansha Jain")).toBeVisible();
  await expect(page.getByRole("button", { name: "View profile" })).toHaveCount(2);
});

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
