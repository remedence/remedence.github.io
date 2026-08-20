import { defineConfig } from "@playwright/test";

const rawPort = process.env.REMEDENCE_SITE_E2E_PORT ?? "43991";
const e2ePort = Number.parseInt(rawPort, 10);

if (!/^\d+$/.test(rawPort) || e2ePort < 1024 || e2ePort > 65535) {
  throw new Error(
    "REMEDENCE_SITE_E2E_PORT must be an integer from 1024 through 65535.",
  );
}

const baseURL = `http://127.0.0.1:${e2ePort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL,
    channel: "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${e2ePort}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
