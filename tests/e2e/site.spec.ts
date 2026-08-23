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
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-320", width: 320, height: 720 },
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

test("desktop hero copy and verification trace share the same top edge", async ({
  page,
}) => {
  for (const width of [1440, 1280, 1120]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const [copyTop, traceTop] = await Promise.all([
      page
        .locator(".hero-copy")
        .evaluate((element) => element.getBoundingClientRect().top),
      page
        .locator(".verification-trace")
        .evaluate((element) => element.getBoundingClientRect().top),
    ]);

    expect(Math.abs(copyTop - traceTop)).toBeLessThanOrEqual(1);
  }
});

test("verification status aligns with the verification trace heading", async ({
  page,
}) => {
  for (const width of [1440, 1280, 1120]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const [headingBox, statusBox] = await Promise.all([
      page
        .getByRole("heading", { level: 2, name: "Verification trace" })
        .boundingBox(),
      page.locator(".status-failed").boundingBox(),
    ]);

    expect(headingBox).not.toBeNull();
    expect(statusBox).not.toBeNull();

    const headingCenter = headingBox!.y + headingBox!.height / 2;
    const statusCenter = statusBox!.y + statusBox!.height / 2;
    expect(Math.abs(headingCenter - statusCenter)).toBeLessThanOrEqual(2);
  }
});

test("verification trace icons stay centered inside their marker circles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const offsets = await page.locator(".trace-marker").evaluateAll((markers) =>
    markers.map((marker) => {
      const markerBox = marker.getBoundingClientRect();
      const iconBox = marker.querySelector("svg")!.getBoundingClientRect();
      return {
        x:
          iconBox.left +
          iconBox.width / 2 -
          (markerBox.left + markerBox.width / 2),
        y:
          iconBox.top +
          iconBox.height / 2 -
          (markerBox.top + markerBox.height / 2),
      };
    }),
  );

  expect(offsets).toHaveLength(5);
  for (const offset of offsets) {
    expect(Math.abs(offset.x)).toBeLessThanOrEqual(0.5);
    expect(Math.abs(offset.y)).toBeLessThanOrEqual(0.5);
  }
});

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
  await mobileNav.getByRole("link", { name: "Platform", exact: true }).click();
  await expect(page.locator("#platform")).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("Escape closes mobile navigation and returns focus to the toggle", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
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
    page.getByRole("link", { name: /Get started locally/i }),
  ).toHaveAttribute("href", "/get-started/");
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
      /Persistent local core v1 is available on main with durable SQLite state, retained failed verification history, locked evidence, and immutable reports/,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Planned only: Remedence Cloud is not implemented or available. No public pricing or launch date has been announced.",
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Local v1 has no user authentication."),
  ).toBeVisible();
});

test("real product screenshots load at native dimensions without distortion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const productSection = page.getByRole("region", {
    name: "See Remedence in action",
  });
  const screenshots = productSection.getByRole("img");
  await expect(screenshots).toHaveCount(5);

  for (let index = 0; index < 5; index += 1) {
    const screenshot = screenshots.nth(index);
    await screenshot.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        screenshot.evaluate((image: HTMLImageElement) => ({
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          currentSrc: image.currentSrc,
        })),
      )
      .toEqual(
        expect.objectContaining({
          complete: true,
          currentSrc: expect.stringMatching(/\.(avif|webp)$/),
        }),
      );

    const naturalRatio = await screenshot.evaluate(
      (image) => image.naturalWidth / image.naturalHeight,
    );
    expect(Math.abs(naturalRatio - 1.6)).toBeLessThan(0.01);

    const renderedRatio = await screenshot.evaluate((image) => {
      const bounds = image.getBoundingClientRect();
      return bounds.width / bounds.height;
    });
    expect(Math.abs(renderedRatio - 1.6)).toBeLessThan(0.01);
  }

  await expect(
    page.getByText(
      "All organizations, people, findings, identifiers, and workflow data shown here are seeded fictional demo data.",
    ),
  ).toBeVisible();
});

test("publishes a valid public llms.txt instead of the SPA fallback", async ({
  request,
}) => {
  const response = await request.get("/llms.txt");
  const body = await response.text();

  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("text/plain");
  expect(body).toMatch(/^# Remedence$/m);
  expect(body).toContain("Persistent local v1");
  expect(body).toContain("- [Source](https://github.com/remedence/remedence)");
  expect(body).toContain("- [Public website](https://remedence.github.io/)");
  expect(body).not.toContain("workers.dev");
});

test("reduced motion collapses routine transitions", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const transitionDuration = await page
    .getByRole("link", { name: /Get started locally/i })
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
  await page.getByRole("link", { name: /Get started locally/i }).click();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Run the five-minute Remedence demo.",
    }),
  ).toBeVisible();

  expect(failures.consoleErrors).toEqual([]);
  expect(failures.pageErrors).toEqual([]);
  expect(failures.transportFailures).toEqual([]);
  expect(failures.httpFailures).toEqual([]);
});

test("crawlable release routes expose truthful public boundaries", async ({
  page,
}) => {
  const expectations = [
    ["/get-started/", "Run the five-minute Remedence demo."],
    ["/docs/", "Operate from the implemented contract."],
    ["/security/", "Implemented controls and missing controls, side by side."],
    ["/cloud/", "Remedence Cloud is future work."],
    ["/open-source/", "Public source. License pending."],
    ["/contact/", "No public intake channel is configured yet."],
  ] as const;

  for (const [route, heading] of expectations) {
    await page.goto(route);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }
});

test("interactive API reference uses the canonical unauthenticated contract", async ({
  page,
}) => {
  await page.goto("/docs/api/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Canonical OpenAPI 3.1 reference.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Authentication is unavailable in local v1."),
  ).toBeVisible();
  await expect(page.getByText("Remedence API", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Filter operations")).toBeVisible();
  await expect(page.getByRole("button", { name: /try it out/i })).toHaveCount(
    0,
  );
});

test("documentation routes have no automated WCAG AA violations", async ({
  page,
}) => {
  for (const route of ["/get-started/", "/docs/", "/docs/api/", "/security/"]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations, route).toEqual([]);
  }
});

test("public route sitemap and OpenAPI contract are static assets", async ({
  request,
}) => {
  const [sitemap, openapi] = await Promise.all([
    request.get("/sitemap.xml"),
    request.get("/openapi.yaml"),
  ]);
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).toContain(
    "https://remedence.github.io/docs/api/",
  );
  expect(openapi.ok()).toBe(true);
  expect(await openapi.text()).toMatch(/^openapi: 3\.1\.0/m);
});
