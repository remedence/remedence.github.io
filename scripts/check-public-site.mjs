import { access, readFile, stat } from "node:fs/promises";

const routes = [
  "product",
  "open-source",
  "cloud",
  "integrations",
  "company",
  "contact",
  "get-started",
  "security",
  "roadmap",
  "changelog",
  "status",
  "docs",
  "docs/install",
  "docs/architecture",
  "docs/administration",
  "docs/api",
  "docs/troubleshooting",
  "docs/upgrades",
  "docs/security",
  "solutions/msps",
  "solutions/security-teams",
  "solutions/vciso",
  "solutions/auditors",
  "solutions/integrators",
  "legal/privacy",
  "legal/terms",
  "legal/acceptable-use",
  "legal/trademark",
  "legal/cookies",
  "legal/accessibility",
];

for (const route of routes) {
  const routeFile = `dist/${route}/index.html`;
  await access(routeFile);
  const routeHtml = await readFile(routeFile, "utf8");
  const canonical = `https://remedence.github.io/${route}/`;
  if (!routeHtml.includes(`<link rel="canonical" href="${canonical}" />`)) {
    throw new Error(`Canonical mismatch for ${route}`);
  }
  if (!routeHtml.includes(`<meta property="og:title" content=`)) {
    throw new Error(`Open Graph title missing for ${route}`);
  }
  if (!routeHtml.includes(`<meta name="twitter:description" content=`)) {
    throw new Error(`Twitter description missing for ${route}`);
  }
}

const index = await readFile("dist/index.html", "utf8");
for (const required of [
  "Content-Security-Policy",
  'rel="canonical"',
  "application/ld+json",
  "twitter:description",
  "og:image:width",
]) {
  if (!index.includes(required))
    throw new Error(`Missing metadata: ${required}`);
}

const sitemap = await readFile("dist/sitemap.xml", "utf8");
for (const route of routes) {
  if (!sitemap.includes(`https://remedence.github.io/${route}/`))
    throw new Error(`Sitemap missing ${route}`);
}

const source = `${await readFile("src/App.tsx", "utf8")}\n${await readFile("src/SitePage.tsx", "utf8")}`;
const routeSet = new Set(["/", ...routes.map((route) => `/${route}/`)]);
for (const match of source.matchAll(/href="(\/[^"]*)"/g)) {
  const destination = match[1];
  if (!destination.startsWith("//") && !routeSet.has(destination)) {
    throw new Error(`Internal link has no generated route: ${destination}`);
  }
}

for (const asset of [
  "dist/product/dashboard-action-queue.webp",
  "dist/product/dashboard-action-queue.avif",
])
  await access(asset);

const budgets = { js: 350_000, css: 250_000 };
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const entry = Object.values(manifest).find((item) => item.isEntry);
const jsSize = (await stat(`dist/${entry.file}`)).size;
if (jsSize > budgets.js)
  throw new Error(`Entry JS ${jsSize} exceeds ${budgets.js}`);
for (const cssFile of entry.css ?? []) {
  const cssSize = (await stat(`dist/${cssFile}`)).size;
  if (cssSize > budgets.css)
    throw new Error(`CSS ${cssSize} exceeds ${budgets.css}`);
}

console.log(
  `Public-site QA passed: ${routes.length} routes, metadata, sitemap, responsive assets, and byte budgets.`,
);
