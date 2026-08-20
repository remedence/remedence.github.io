import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

interface BrowserFailures {
  consoleErrors: string[];
  pageErrors: string[];
  transportFailures: string[];
  httpFailures: string[];
}

function observeBrowserFailures(page: Page): BrowserFailures {
  const failures: BrowserFailures = {
    consoleErrors: [],
    pageErrors: [],
    transportFailures: [],
    httpFailures: [],
  };

  page.on("console", (message) => {
    if (message.type() === "error") failures.consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => failures.pageErrors.push(error.message));
  page.on("requestfailed", (request) =>
    failures.transportFailures.push(request.url()),
  );
  page.on("response", (response) => {
    if (response.status() >= 400) {
      failures.httpFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  return failures;
}

const viewports = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "mobile-390", width: 390, height: 844 },
] as const;

for (const viewport of viewports) {
  test(`${viewport.name} keeps the public story usable without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Security work. Proven complete.",
      }),
    ).toBeVisible();
    await expect(page.getByText("SEC-1042", { exact: true })).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
}

test("keyboard order exposes the skip link and mobile navigation works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to main content" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Remedence home" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");

  const mobileNav = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(mobileNav).toBeVisible();
  await mobileNav.getByRole("link", { name: "API", exact: true }).click();
  await expect(page.locator("#api")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("responsive menu stays open until the desktop navigation breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 1001, height: 800 });
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.setViewportSize({ width: 1120, height: 800 });
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
});

test("public calls to action point only to real destinations", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: /View on GitHub/i }).first(),
  ).toHaveAttribute("href", "https://github.com/remedence/remedence");
  await expect(
    page.getByRole("link", { name: /Explore the platform/i }),
  ).toHaveAttribute("href", "#platform");
  await expect(
    page.getByRole("link", { name: /View the API/i }),
  ).toHaveAttribute(
    "href",
    "https://github.com/remedence/remedence/blob/main/api/openapi.yaml",
  );
  await expect(
    page.getByRole("link", { name: /Read the docs/i }).first(),
  ).toHaveAttribute(
    "href",
    "https://github.com/remedence/remedence/tree/main/docs",
  );
  await expect(page.getByRole("link", { name: /sign in/i })).toHaveCount(0);
  await expect(
    page.getByText(
      "Public cloud availability and pricing will be published when they are ready.",
    ),
  ).toBeVisible();
});

test("reduced motion collapses routine transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const transitionDuration = await page
    .getByRole("link", { name: /Explore the platform/i })
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(transitionDuration)).toBeLessThanOrEqual(0.001);
});

test("desktop and mobile public pages have no automated WCAG AA violations", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("HTTP failures are observed separately from transport failures", async ({
  page,
}) => {
  const failures = observeBrowserFailures(page);
  await page.route("**/brand/remedence-logo-primary-ui.png", (route) =>
    route.fulfill({ status: 404, body: "missing" }),
  );
  await page.route("**/redirect-probe", (route) =>
    route.fulfill({ status: 302, headers: { location: "/" } }),
  );

  const logoResponse = page.waitForResponse(
    (response) =>
      response.status() === 404 &&
      response.url().endsWith("/brand/remedence-logo-primary-ui.png"),
  );
  await page.goto("/");
  await logoResponse;
  await page.evaluate(() => fetch("/redirect-probe"));

  expect(failures.httpFailures).toHaveLength(1);
  expect(failures.httpFailures[0]).toMatch(
    /^404 .*\/brand\/remedence-logo-primary-ui\.png$/,
  );
  expect(failures.transportFailures).toEqual([]);
});

test("public site loads without console errors or failed application requests", async ({
  page,
}) => {
  const failures = observeBrowserFailures(page);

  await page.goto("/");
  await page.getByRole("link", { name: /Explore the platform/i }).click();
  await expect(page.locator("#platform")).toBeInViewport();

  expect(failures.consoleErrors).toEqual([]);
  expect(failures.pageErrors).toEqual([]);
  expect(failures.transportFailures).toEqual([]);
  expect(failures.httpFailures).toEqual([]);
});
