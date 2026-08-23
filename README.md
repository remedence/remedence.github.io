# Remedence website

Official public website for Remedence, a publicly developed security remediation, independent verification, and evidence platform. The product repository does not currently publish an explicit license.

**Security work. Proven complete.**

The site explains the Remedence model:

`Remediate -> Verify -> Prove`

A remediation claim is not treated as closure until an independent verification path passes and supporting evidence exists.

## Development

```powershell
npm install
npm run dev
```

Quality checks:

```powershell
npm run format:check
npm run lint
npm run typecheck
npm test
npm run e2e
npm run build
```

## Deployment

GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`.

Production URL: https://remedence.github.io/

The approved Remedence brand assets live under `public/brand`, `public/favicons`, and `public/social`. They are sourced from the project Drive and must not be replaced with generated logo artwork.
