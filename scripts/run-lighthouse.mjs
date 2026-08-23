import { mkdir, readFile, writeFile } from "node:fs/promises";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { preview } from "vite";

const config = JSON.parse(await readFile("lighthouserc.json", "utf8"));
const port = 43992;
const server = await preview({
  preview: { host: "127.0.0.1", port, strictPort: true },
});
const chrome = await chromeLauncher.launch({
  chromeFlags: ["--headless", "--disable-gpu", "--no-sandbox"],
});

await mkdir("artifacts/lighthouse", { recursive: true });
let failed = false;

try {
  for (const configuredUrl of config.ci.collect.url) {
    const route = new URL(configuredUrl).pathname;
    const result = await lighthouse(`http://127.0.0.1:${port}${route}`, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
    });
    if (!result) throw new Error(`Lighthouse returned no result for ${route}`);

    const slug =
      route === "/" ? "home" : route.replaceAll("/", "-").replace(/^-|-$/g, "");
    await writeFile(`artifacts/lighthouse/${slug}.json`, result.report);

    for (const [assertion, [severity, threshold]] of Object.entries(
      config.ci.assert.assertions,
    )) {
      let value;
      let passes;
      if (assertion.startsWith("categories:")) {
        const category = assertion.slice("categories:".length);
        value = result.lhr.categories[category].score;
        passes = value >= threshold.minScore;
      } else {
        value = result.lhr.audits[assertion].numericValue;
        passes = value <= threshold.maxNumericValue;
      }
      if (!passes) {
        const message = `${route} ${assertion} failed: ${value}`;
        if (severity === "error") {
          console.error(message);
          failed = true;
        } else {
          console.warn(message);
        }
      }
    }

    const scores = Object.fromEntries(
      Object.entries(result.lhr.categories).map(([name, category]) => [
        name,
        category.score,
      ]),
    );
    console.log(`${route} ${JSON.stringify(scores)}`);
  }
} finally {
  await chrome.kill();
  await new Promise((resolve, reject) =>
    server.httpServer.close((error) => (error ? reject(error) : resolve())),
  );
}

if (failed) process.exitCode = 1;
