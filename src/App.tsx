import { useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Cloud,
  Code2,
  ExternalLink,
  FileCheck2,
  FileText,
  GitBranch,
  Menu,
  Network,
  Server,
  TerminalSquare,
  Users,
  X,
  XCircle,
} from "lucide-react";
import "./App.css";

const navItems = [
  ["Platform", "#platform"],
  ["Open Source", "#open-source"],
  ["API", "#api"],
  ["Integrations", "#integrations"],
  ["Cloud", "#cloud"],
  ["Security", "#security"],
  ["Docs", "#docs"],
  ["Partners", "#partners"],
  ["Company", "#company"],
] as const;

const workflow = [
  {
    number: "01",
    title: "Remediate",
    copy: "Take findings from existing security tools and track the work required to address them.",
  },
  {
    number: "02",
    title: "Verify",
    copy: "Run a separate verification path. A patch does not certify itself.",
  },
  {
    number: "03",
    title: "Prove",
    copy: "Lock the evidence and produce defensible proof for the MSP, customer, auditor, or security team.",
  },
] as const;

const openSourceFeatures = [
  "Self-hosted deployment",
  "API-first architecture",
  "Normalized findings",
  "Remediation workflow",
  "Verification framework",
  "Evidence records",
  "Operational UI",
] as const;

const cloudCapabilities = [
  "Managed hosting",
  "Hosted verification workers",
  "Managed integrations",
  "Team collaboration",
  "MSP operating scale",
  "Client and QBR automation",
  "Enterprise identity",
  "Backup and support",
] as const;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnWideScreen = () => {
      if (window.innerWidth >= 940) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnWideScreen);
    return () => window.removeEventListener("resize", closeOnWideScreen);
  }, []);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand-link"
            href="#top"
            aria-label="Remedence home"
            onClick={() => setMenuOpen(false)}
          >
            <img src="/brand/remedence-logo-primary.png" alt="Remedence" />
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map(([label, href]) => (
              <a key={href} href={href}>
                {label}
              </a>
            ))}
          </nav>

          <a
            className="header-github"
            href="https://github.com/remedence/remedence"
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch aria-hidden="true" size={17} />
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <a
              href="https://github.com/remedence/remedence"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              View on GitHub
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          </nav>
        )}
      </header>

      <main id="main-content">
        <section className="hero section" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Open source</p>
            <p className="hero-kicker">Verified security remediation</p>
            <h1 id="hero-title">Security work. Proven complete.</h1>
            <p className="hero-lede">
              Remediate the finding. Verify the fix. Prove it is closed.
            </p>
            <p className="hero-support">
              Remedence connects security findings to remediation, independent
              verification, and evidence so closure is based on proof, not a
              status field.
            </p>
            <div className="hero-actions" aria-label="Primary actions">
              <a
                className="button button-primary"
                href="https://github.com/remedence/remedence"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
                <GitBranch aria-hidden="true" size={18} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a className="button button-secondary" href="#platform">
                Explore the platform
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
            <p className="availability-note">
              Open core. API first. Self-hostable.
            </p>
          </div>

          <div
            className="verification-trace"
            aria-label="Example independent verification trace"
          >
            <div className="trace-header">
              <div>
                <span className="mono trace-id">SEC-1042</span>
                <h2>Verification trace</h2>
              </div>
              <span className="status status-failed">
                <XCircle aria-hidden="true" /> First check failed
              </span>
            </div>
            <p className="trace-title">SQL injection in patient-export API</p>
            <ol className="trace-list">
              <li>
                <span className="trace-marker trace-complete">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <div>
                  <strong>Finding imported</strong>
                  <span>Critical · patient-export API</span>
                </div>
              </li>
              <li>
                <span className="trace-marker trace-complete">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <div>
                  <strong>Primary path patched</strong>
                  <span>Remediation reference attached</span>
                </div>
              </li>
              <li className="trace-attention">
                <span className="trace-marker">
                  <XCircle aria-hidden="true" />
                </span>
                <div>
                  <strong>Independent verification failed</strong>
                  <span>Secondary query path remained exploitable</span>
                </div>
              </li>
              <li>
                <span className="trace-marker trace-complete">
                  <CheckCircle2 aria-hidden="true" />
                </span>
                <div>
                  <strong>Secondary path remediated</strong>
                  <span>Verification rerun independently</span>
                </div>
              </li>
              <li className="trace-success">
                <span className="trace-marker">
                  <FileCheck2 aria-hidden="true" />
                </span>
                <div>
                  <strong>Verified fixed</strong>
                  <span>Evidence bundle locked for closure</span>
                </div>
              </li>
            </ol>
            <div className="patched-rule">
              <span>PATCHED</span>
              <span aria-hidden="true">≠</span>
              <strong>VERIFIED FIXED</strong>
            </div>
          </div>
        </section>

        <section
          className="principle-band"
          aria-label="Core Remedence principle"
        >
          <div className="section principle-inner">
            <span className="mono">REMEDENCE / CONTROL PRINCIPLE</span>
            <strong>PATCHED ≠ VERIFIED FIXED</strong>
            <span>
              A remediation claim becomes closure only after a separate
              verification path produces evidence.
            </span>
          </div>
        </section>

        <section
          className="section workflow-section"
          id="platform"
          aria-labelledby="workflow-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Platform</p>
            <h2 id="workflow-title">Remediate → Verify → Prove</h2>
            <p>
              One accountable path from an imported finding to evidence-backed
              closure.
            </p>
          </div>
          <div className="workflow-grid">
            {workflow.map((step) => (
              <article key={step.number} className="workflow-step">
                <span className="mono workflow-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="section ecosystem-section"
          id="open-source"
          aria-labelledby="ecosystem-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Ecosystem</p>
            <h2 id="ecosystem-title">
              Open where control matters. Managed where operations get heavy.
            </h2>
            <p>
              Use the open-source core on your infrastructure, then add managed
              operations when the tradeoff makes sense.
            </p>
          </div>
          <div className="ecosystem-split">
            <article className="ecosystem-column">
              <div className="ecosystem-title-row">
                <Server aria-hidden="true" />
                <div>
                  <p className="mono">REMEDENCE OPEN SOURCE</p>
                  <h3>Own the remediation record.</h3>
                </div>
              </div>
              <p>
                Run the canonical platform yourself and keep the workflow
                inspectable.
              </p>
              <ul className="feature-list">
                {openSourceFeatures.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                className="text-link"
                href="https://github.com/remedence/remedence"
                target="_blank"
                rel="noreferrer"
              >
                Explore the source <ArrowRight aria-hidden="true" size={17} />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </article>
            <article className="ecosystem-column ecosystem-cloud" id="cloud">
              <div className="ecosystem-title-row">
                <Cloud aria-hidden="true" />
                <div>
                  <p className="mono">REMEDENCE CLOUD</p>
                  <h3>Reduce the operating burden.</h3>
                </div>
              </div>
              <p>
                The managed layer is for teams that want hosted execution and
                MSP-scale operations without running every service themselves.
              </p>
              <ul className="feature-list">
                {cloudCapabilities.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="release-note">
                Public cloud availability and pricing will be published when
                they are ready.
              </p>
            </article>
          </div>
        </section>

        <section
          className="technical-band"
          id="api"
          aria-labelledby="api-title"
        >
          <div className="section api-layout">
            <div className="section-heading api-copy">
              <p className="eyebrow">API first</p>
              <h2 id="api-title">
                One contract for the UI, CLI, integrations, and automation.
              </h2>
              <p>
                The canonical REST surface is versioned under{" "}
                <span className="mono">/api/v1</span> with an OpenAPI 3.1
                contract in the platform repository.
              </p>
              <div className="inline-links">
                <a
                  className="button button-secondary"
                  href="https://github.com/remedence/remedence/blob/main/api/openapi.yaml"
                  target="_blank"
                  rel="noreferrer"
                >
                  View the API <Code2 aria-hidden="true" size={18} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                <a
                  className="text-link"
                  href="https://github.com/remedence/remedence/tree/main/docs"
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the docs <ArrowRight aria-hidden="true" size={17} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </div>
            <div
              className="endpoint-list"
              aria-label="Initial API resource families"
            >
              {[
                "companies",
                "assets",
                "findings",
                "remediations",
                "verifications",
                "evidence",
                "reports",
                "imports",
                "webhooks",
                "integrations",
              ].map((resource) => (
                <div key={resource}>
                  <span className="method">REST</span>
                  <code>/api/v1/{resource}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section capability-grid-section"
          id="integrations"
          aria-labelledby="integrations-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Integrations</p>
            <h2 id="integrations-title">
              Bring findings in. Send accountable state back out.
            </h2>
            <p>
              Remedence is designed to sit between the tools that discover risk
              and the systems where remediation work gets done.
            </p>
          </div>
          <div className="capability-grid">
            <article>
              <Network aria-hidden="true" />
              <h3>Normalize findings</h3>
              <p>
                Map source-specific results into one finding model without
                hiding provenance.
              </p>
            </article>
            <article>
              <GitBranch aria-hidden="true" />
              <h3>Track remediation</h3>
              <p>
                Keep changes, ownership, and remediation references connected to
                the finding.
              </p>
            </article>
            <article>
              <TerminalSquare aria-hidden="true" />
              <h3>Verify independently</h3>
              <p>
                Run checks through a separate verification path and preserve the
                method used.
              </p>
            </article>
            <article>
              <FileCheck2 aria-hidden="true" />
              <h3>Lock evidence</h3>
              <p>
                Attach verification outcomes and evidence to closure instead of
                relying on a patched flag.
              </p>
            </article>
          </div>
        </section>

        <section
          className="section security-section"
          id="security"
          aria-labelledby="security-title"
        >
          <div className="section-heading">
            <p className="eyebrow">Security model</p>
            <h2 id="security-title">
              The verifier should not grade its own work.
            </h2>
          </div>
          <div className="security-lines">
            <div>
              <span className="mono">01</span>
              <div>
                <h3>Separate remediation from verification</h3>
                <p>
                  Record what changed, then validate the outcome through an
                  independent path.
                </p>
              </div>
            </div>
            <div>
              <span className="mono">02</span>
              <div>
                <h3>Keep evidence provenance visible</h3>
                <p>
                  Preserve method, source, scope, timestamp, and outcome
                  alongside the finding.
                </p>
              </div>
            </div>
            <div>
              <span className="mono">03</span>
              <div>
                <h3>Make failed verification useful</h3>
                <p>
                  A failed check returns the finding to remediation with a
                  concrete reason instead of masking uncertainty.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="resource-band"
          id="docs"
          aria-labelledby="docs-title"
        >
          <div className="section">
            <div className="section-heading resource-heading">
              <p className="eyebrow">Build with Remedence</p>
              <h2 id="docs-title">
                Inspect the architecture before you depend on it.
              </h2>
            </div>
            <div className="resource-links">
              <a
                href="https://github.com/remedence/remedence"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch aria-hidden="true" />
                <span>
                  <strong>Source</strong>
                  <small>Canonical open-source repository</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </a>
              <a
                href="https://github.com/remedence/remedence/tree/main/docs"
                target="_blank"
                rel="noreferrer"
              >
                <FileText aria-hidden="true" />
                <span>
                  <strong>Docs</strong>
                  <small>Architecture and implementation notes</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </a>
              <a
                href="https://github.com/remedence/remedence/blob/main/api/openapi.yaml"
                target="_blank"
                rel="noreferrer"
              >
                <Code2 aria-hidden="true" />
                <span>
                  <strong>OpenAPI</strong>
                  <small>Versioned API contract</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section
          className="section partners-company"
          aria-label="Partners and company"
        >
          <article id="partners">
            <Users aria-hidden="true" />
            <p className="eyebrow">Partners</p>
            <h2>Built for the teams between findings and customers.</h2>
            <p>
              MSPs, vCISOs, security teams, developers, and integrators need the
              same thing at closure: evidence that the fix actually held.
            </p>
          </article>
          <article id="company">
            <Building2 aria-hidden="true" />
            <p className="eyebrow">Company</p>
            <h2>Remedence is being built in the open.</h2>
            <p>
              Follow the public repository for the implementation, architecture,
              and project history. We do not publish invented customer claims or
              certification badges.
            </p>
            <a
              className="text-link"
              href="https://github.com/remedence"
              target="_blank"
              rel="noreferrer"
            >
              Visit the GitHub organization{" "}
              <ArrowRight aria-hidden="true" size={17} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </article>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section footer-inner">
          <a className="footer-brand" href="#top" aria-label="Remedence home">
            <img src="/brand/remedence-logo-primary.png" alt="Remedence" />
          </a>
          <p>Security work. Proven complete.</p>
          <div className="footer-links">
            <a
              href="https://github.com/remedence/remedence"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a href="#api">API</a>
            <a href="#docs">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
