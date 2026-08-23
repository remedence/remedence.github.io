import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parse } from "yaml";

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

const descriptions = {
  "get-started":
    "Install, build, start, and evaluate Remedence local v1 in five minutes.",
  docs: "Remedence local v1 installation, architecture, administration, API, troubleshooting, upgrade, and security documentation.",
  security:
    "Implemented and planned Remedence security controls and responsible disclosure guidance.",
  cloud: "Truthful status of planned Remedence Cloud capabilities.",
};

const baseHtml = await readFile("dist/index.html", "utf8");
const openApiYaml = await readFile("public/openapi.yaml", "utf8");
await writeFile("dist/openapi.json", JSON.stringify(parse(openApiYaml)));

for (const route of routes) {
  const outputDirectory = join("dist", route);
  await mkdir(outputDirectory, { recursive: true });
  const canonical = `https://remedence.github.io/${route}/`;
  const label = route.split("/").at(-1).replaceAll("-", " ");
  const title = `${label[0].toUpperCase()}${label.slice(1)} | Remedence`;
  const description =
    descriptions[route] ??
    "Remedence product, documentation, security, policy, and public project information.";
  const html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<link rel="canonical" href="[^"]+" \/>/,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replace(
      /<meta property="og:url" content="[^"]+" \/>/,
      `<meta property="og:url" content="${canonical}" />`,
    )
    .replace(
      /content="Remedence connects security findings[^"]+"/,
      `content="${description}"`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]+"\s*\/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]+"\s*\/>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]+"\s*\/>/,
      `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]+"\s*\/>/,
      `<meta name="twitter:description" content="${description}" />`,
    );
  await writeFile(join(outputDirectory, "index.html"), html);
}

await cp("dist/index.html", "dist/404.html");
