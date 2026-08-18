import { test, expect } from "@playwright/test";

// PRD §7.9's named smoke path: home → events → detail → Join click.
test("home → events → detail → Join click", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.getByRole("link", { name: "Events" }).first().click();
  await expect(page).toHaveURL(/\/events/);
  await expect(page.getByRole("heading", { name: "Events" })).toBeVisible();

  const firstCard = page.locator("main a[href^='/events/']").first();
  await expect(firstCard).toBeVisible();
  const href = await firstCard.getAttribute("href");
  await firstCard.click();
  await expect(page).toHaveURL(new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const [joinPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Join", exact: true }).first().click(),
  ]);
  await joinPage.waitForLoadState("domcontentloaded");
  expect(joinPage.url()).toContain("gdg.community.dev");
  await joinPage.close();
});

test("404 on an unknown event slug shows branded not-found content", async ({ page }) => {
  await page.goto("/events/this-event-does-not-exist");
  await expect(page.getByText("Page not found")).toBeVisible();
  await page.getByRole("link", { name: "Back to Home" }).click();
  await expect(page).toHaveURL("/");
});
