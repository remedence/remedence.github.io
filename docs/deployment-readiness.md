# Deployment readiness

## Custom domain and redirects

The production origin remains `https://remedence.github.io/`. No domain has been purchased, no DNS records are authorized, and this repository intentionally has no `CNAME` file.

When a domain is approved, verify ownership, configure the GitHub Pages custom-domain setting, add the exact `CNAME`, enforce HTTPS, change canonical/structured-data/sitemap origins in one commit, and verify both apex and `www` behavior. Keep old GitHub Pages URLs reachable or redirect them only through an approved edge that preserves paths and query strings. GitHub Pages does not provide a general server-side redirect rule file.

## Browser security policy

GitHub Pages does not expose per-repository response-header configuration. The application therefore ships a meta-delivered CSP and referrer policy. `X-Content-Type-Options`, `Permissions-Policy`, frame protection as a response header, and a stronger nonce/hash CSP require an approved custom edge or hosting change. Do not claim those response headers are present until live inspection proves them.

## Analytics

No analytics vendor, cookie, advertising tag, or session-replay script is enabled. Any future analytics change requires explicit approval, data-minimization and retention documentation, a privacy-notice update, and consent handling where applicable.

## Preview and branch protection

Pull requests should run the complete `npm run check` workflow and retain the Vite build as a review artifact. GitHub Pages production deployment remains restricted to `main`; do not publish PR code to the production Pages environment. Configure branch protection to require the check workflow, current review requirements, resolved conversations, and no force pushes. Repository administrators must apply these settings in GitHub; this file does not claim that they are active.
