# Public Site Post-v1 Review Repairs Plan

> **Execution:** Use superpowers:test-driven-development for each behavior change and superpowers:verification-before-completion before merge.

**Goal:** Fix the two verified Codex review defects in `remedence.github.io`, establish cross-platform formatting, run full browser validation, and prepare the site for a later truthful product-capability update after the persistent core ships.

**Branch:** `fix/post-v1-codex-review`

**Base:** `origin/main` at `3f08717f224f923e75a90447961a52df69844a93`

**Tech stack:** React 19, TypeScript, Vite 8, Vitest, Playwright, axe-core.

## Constraints

- Preserve the existing approved Remedence visual system and brand assets.
- Do not publish backend, cloud, sign-in, pricing, worker, integration, AI, or authentication claims before those capabilities exist.
- Do not change the GitHub Pages deployment model.
- Do not terminate unrelated browser, Node, tunnel, MCP, or gateway processes.
- Use microscopic commits and self-review the complete branch diff before merge.

### Task 1: Establish a Windows-safe formatting baseline

**Files:**

- Create: `.gitattributes`
- Modify: `package.json`

- [ ] **Step 1: Capture the existing failure**

Run:

```powershell
git ls-files --eol package.json src/App.tsx tests/e2e/site.spec.ts
npm run format:check
```

Expected before the fix on this Windows checkout:

```text
i/lf w/crlf
Code style issues found
```

- [ ] **Step 2: Add repository line-ending rules**

Create `.gitattributes`:

```gitattributes
* text=auto eol=lf

*.png binary
*.ico binary
```

- [ ] **Step 3: Add a complete local check command**

Add to `package.json`:

```json
{
  "scripts": {
    "check": "npm run format:check && npm run lint && npm run typecheck && npm test && npm run build && npm run e2e"
  }
}
```

- [ ] **Step 4: Normalize and verify**

Run:

```powershell
npm run format
git add --renormalize .
npm run check
git diff --check
```

Expected: 3 Vitest tests and 10 Playwright tests pass with no formatting warning.

- [ ] **Step 5: Commit**

```powershell
git add .gitattributes package.json package-lock.json
git commit -m "chore(site): enforce cross-platform formatting"
```

### Task 2: Align responsive menu behavior with CSS

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`
- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Write a failing component test**

Add a test that:

1. Sets `window.innerWidth` to `1000`.
2. Opens the mobile navigation.
3. Dispatches a resize event at `1001`.
4. Expects the navigation to remain visible.
5. Sets `window.innerWidth` to `1120`.
6. Dispatches resize.
7. Expects the navigation to close.

Use a configurable property descriptor and restore the original width after the test.

- [ ] **Step 2: Write a failing browser regression**

In Playwright:

```ts
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
```

- [ ] **Step 3: Confirm the tests fail**

```powershell
npm test -- --run src/App.test.tsx
npm run e2e -- --grep "responsive menu"
```

Expected: the menu closes at 1001px under the current `940px` threshold.

- [ ] **Step 4: Implement the single-source breakpoint**

Add:

```ts
const MOBILE_NAV_MAX_WIDTH = 1119;
```

Change the resize handler to:

```ts
if (window.innerWidth > MOBILE_NAV_MAX_WIDTH) setMenuOpen(false);
```

This matches `@media (max-width: 1119px)` exactly.

- [ ] **Step 5: Verify and commit**

```powershell
npm test
npm run e2e -- --grep "responsive menu"
git add src/App.tsx src/App.test.tsx tests/e2e/site.spec.ts
git commit -m "fix(site): align responsive navigation breakpoint"
```

### Task 3: Detect HTTP error responses in browser smoke tests

**Files:**

- Modify: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Add a failing detector test**

Create a helper in the test file:

```ts
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
    if (!response.ok()) {
      failures.httpFailures.push(`${response.status()} ${response.url()}`);
    }
  });

  return failures;
}
```

Add a test route returning 404:

```ts
await page.route("**/brand/remedence-logo-primary-ui.png", (route) =>
  route.fulfill({ status: 404, body: "missing" }),
);
```

Navigate and prove the detector records one `404` entry. This test must fail before the response listener is implemented.

- [ ] **Step 2: Replace the incomplete smoke-test listeners**

Use `observeBrowserFailures(page)` in the existing smoke test and assert all four arrays are empty after navigation and CTA interaction.

- [ ] **Step 3: Verify**

```powershell
npm run e2e -- --grep "HTTP|failed application requests"
```

Expected: the detector test catches the injected 404 and the normal site smoke test remains clean.

- [ ] **Step 4: Commit**

```powershell
git add tests/e2e/site.spec.ts
git commit -m "test(site): fail smoke checks on HTTP errors"
```

### Task 4: Run full critique, review, and live deployment validation

**Files:**

- Modify only files required by review findings.

- [ ] **Step 1: Run full local checks**

```powershell
npm ci
npm run check
```

- [ ] **Step 2: Run Design & Taste pre-flight**

Verify desktop, tablet, and mobile navigation, visible focus, reduced motion, 200 percent zoom, no horizontal overflow, no generic AI styling, and truthful CTA destinations. Fix only concrete regressions.

- [ ] **Step 3: Run a complete self-review**

```powershell
git diff origin/main..HEAD --check
git diff --stat origin/main..HEAD
git diff -U20 origin/main..HEAD
```

Review behavior, tests, accessibility, security, state handling, unsupported product claims, unrelated changes, secrets, local paths, and line-ending churn. Fix concrete findings, then rerun `npm run check`.

- [ ] **Step 4: Push and open PR**

```powershell
git push -u origin fix/post-v1-codex-review
gh pr create --repo remedence/remedence.github.io --base main --head fix/post-v1-codex-review --title "fix(site): complete post-v1 browser review" --body-file artifacts/site-repair-pr.md
```

- [ ] **Step 5: Merge and verify GitHub Pages**

After checks pass, merge without force push. Poll the Pages workflow with bounded intervals. Open `https://remedence.github.io/` in a clean browser context and repeat navigation, mobile menu, console, network, keyboard, and accessibility smoke tests.

### Task 5: Update product evidence only after persistent core ships

**Files:**

- Modify later: `src/App.tsx`
- Modify later: `src/App.css`
- Add later: `public/product/*.png`
- Modify later: `src/App.test.tsx`
- Modify later: `tests/e2e/site.spec.ts`

- [ ] **Step 1: Wait for the persistent-core merge SHA and validated screenshot**

Do not begin this task until `remedence/remedence` has a merged persistent local core and the screenshot was captured from the validated production local build.

- [ ] **Step 2: Add one evidence-led product screenshot**

Show the real Dashboard and SEC-1042 failed-first-verification workflow. Use an approved captured screenshot, descriptive alt text, intrinsic dimensions, and responsive delivery. Do not recreate the UI as decorative artwork.

- [ ] **Step 3: Replace future tense with implemented capabilities**

Update copy only for features that shipped, such as local SQLite persistence, canonical API, durable remediation history, verification history, locked evidence metadata, audit events, and report snapshots. Keep authentication, cloud hosting, workers, managed integrations, and AI inference clearly deferred.

- [ ] **Step 4: Re-run the full site workflow**

Run tests, Design & Taste critique, Lighthouse desktop/mobile, complete self-review, PR, merge, Pages workflow, and live-browser verification again.
