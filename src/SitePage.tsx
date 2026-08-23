import { lazy, Suspense, type ReactNode } from "react";
import { ExternalLink, GitBranch } from "lucide-react";

const ApiDocs = lazy(() => import("./ApiDocs"));

type Section = {
  heading: string;
  body: ReactNode;
};

type Page = {
  eyebrow: string;
  title: string;
  description: string;
  sections: Section[];
};

const code = (value: string) => (
  <pre>
    <code>{value}</code>
  </pre>
);

const pages: Record<string, Page> = {
  "/get-started/": {
    eyebrow: "Local v1 quickstart",
    title: "Run the five-minute Remedence demo.",
    description:
      "Install and start the persistent local product from its public repository. Local v1 is unauthenticated and loopback-only.",
    sections: [
      {
        heading: "Requirements",
        body: (
          <>
            <p>
              Node.js <code>&gt;=24.15.0 &lt;27</code>, npm, Git, and a
              supported local shell.
            </p>
            <p>
              The repository has no explicit license. You may inspect the public
              source, but do not infer reuse rights.
            </p>
          </>
        ),
      },
      {
        heading: "Install and start",
        body: (
          <>
            {code(
              "git clone https://github.com/remedence/remedence.git\ncd remedence\nnpm ci\nnpm run build\nnpm run start",
            )}
            <p>
              Open the loopback URL printed by the process. The default API port
              is <code>43180</code>.
            </p>
          </>
        ),
      },
      {
        heading: "Five-minute demo",
        body: (
          <ol>
            <li>
              Open the seeded action queue and select finding{" "}
              <code>SEC-1042</code>.
            </li>
            <li>
              Inspect its remediation record and retained failed verification.
            </li>
            <li>Compare the failed and passing verification runs.</li>
            <li>Open the locked evidence metadata and content hash.</li>
            <li>
              Generate a report snapshot and download its Markdown
              representation.
            </li>
          </ol>
        ),
      },
      {
        heading: "Current limitations",
        body: (
          <ul>
            <li>No user authentication or production multi-user RBAC.</li>
            <li>
              No hosted SaaS, managed integrations, autonomous patch generation,
              or hosted worker fleet.
            </li>
            <li>
              Bind only to <code>127.0.0.1</code>; never expose local v1
              directly to an untrusted network.
            </li>
            <li>
              The Harborline organization and all included workflow data are
              fictional demo data.
            </li>
          </ul>
        ),
      },
    ],
  },
  "/docs/": {
    eyebrow: "Documentation",
    title: "Operate from the implemented contract.",
    description:
      "Structured entry points for installing, understanding, administering, integrating, troubleshooting, upgrading, and securing local v1.",
    sections: [
      {
        heading: "Guides",
        body: (
          <div className="link-grid">
            <a href="/docs/install/">Install and run</a>
            <a href="/docs/architecture/">Architecture</a>
            <a href="/docs/administration/">Administration</a>
            <a href="/docs/api/">Interactive API reference</a>
            <a href="/docs/troubleshooting/">Troubleshooting</a>
            <a href="/docs/upgrades/">Upgrades</a>
            <a href="/docs/security/">Security boundary</a>
          </div>
        ),
      },
    ],
  },
  "/docs/install/": {
    eyebrow: "Documentation · Install",
    title: "Install local v1.",
    description: "Use the repository lockfile and a supported Node release.",
    sections: [
      {
        heading: "Production-local mode",
        body: (
          <>
            {code("npm ci\nnpm run build\nnpm run start")}
            <p>
              The single process serves the built web application and{" "}
              <code>/api/v1</code> from one loopback origin.
            </p>
          </>
        ),
      },
      {
        heading: "Development",
        body: (
          <>
            {code("npm run dev")}
            <p>
              The supervisor starts the API and Vite development process trees
              and cleans up only the children it owns.
            </p>
          </>
        ),
      },
    ],
  },
  "/docs/architecture/": {
    eyebrow: "Documentation · Architecture",
    title: "One local authority from finding to proof.",
    description:
      "The canonical API separates persisted domain truth from the operator-facing React application.",
    sections: [
      {
        heading: "Repository boundaries",
        body: (
          <ul>
            <li>
              <code>apps/web</code>: presentation and typed API consumption.
            </li>
            <li>
              <code>apps/api</code>: loopback HTTP service and production static
              host.
            </li>
            <li>
              <code>packages/core</code>: state transitions and domain services.
            </li>
            <li>
              <code>packages/database</code>: SQLite, migrations, seeding,
              repositories, and backup.
            </li>
            <li>
              <code>packages/evidence</code> and{" "}
              <code>packages/verification</code>: evidence provenance and
              verification contracts.
            </li>
          </ul>
        ),
      },
      {
        heading: "Workflow invariant",
        body: (
          <p>
            A completed remediation can become{" "}
            <strong>Awaiting verification</strong>. Only a separate persisted
            passing verification can produce <strong>Verified fixed</strong> and
            locked evidence.
          </p>
        ),
      },
    ],
  },
  "/docs/administration/": {
    eyebrow: "Documentation · Administration",
    title: "Keep local state explicit.",
    description: "Local v1 stores SQLite data on the machine that runs it.",
    sections: [
      {
        heading: "Environment",
        body: (
          <ul>
            <li>
              <code>REMEDENCE_API_PORT</code>: loopback port from 1024 through
              65535.
            </li>
            <li>
              <code>REMEDENCE_DATA_DIR</code>: data directory; default{" "}
              <code>./data</code>.
            </li>
            <li>
              <code>NODE_ENV=production</code>: enables production web serving
              when starting the compiled server directly.
            </li>
          </ul>
        ),
      },
      {
        heading: "Database operations",
        body: code(
          "npm run db:migrate\nnpm run db:seed\nnpm run db:backup -- --output <file>",
        ),
      },
    ],
  },
  "/docs/troubleshooting/": {
    eyebrow: "Documentation · Troubleshooting",
    title: "Diagnose local startup and state safely.",
    description:
      "Prefer the product's health endpoint and repository checks over deleting state.",
    sections: [
      {
        heading: "Startup",
        body: (
          <ul>
            <li>
              Confirm Node is within <code>&gt;=24.15.0 &lt;27</code>.
            </li>
            <li>
              Run <code>npm ci</code> from the product repository root.
            </li>
            <li>
              Check whether the configured loopback port is already in use.
            </li>
            <li>
              Inspect <code>/healthz</code> on the local API origin.
            </li>
          </ul>
        ),
      },
      {
        heading: "Validation",
        body: (
          <>
            <p>Run the complete product workflow before reporting a defect:</p>
            {code("npm run check")}
          </>
        ),
      },
      {
        heading: "Data safety",
        body: (
          <p>
            Do not delete the SQLite file as a first troubleshooting step. Back
            it up and preserve the failing state for diagnosis.
          </p>
        ),
      },
    ],
  },
  "/docs/upgrades/": {
    eyebrow: "Documentation · Upgrades",
    title: "Upgrade from a recoverable state.",
    description:
      "No stable release or backward-compatibility policy is published yet.",
    sections: [
      {
        heading: "Before changing revisions",
        body: (
          <ol>
            <li>Read the repository changelog and target commit.</li>
            <li>Stop the local process.</li>
            <li>Create a database backup with the current revision.</li>
            <li>
              Install from the updated lockfile with <code>npm ci</code>.
            </li>
            <li>
              Run <code>npm run build</code>; startup applies ordered repository
              migrations.
            </li>
            <li>
              Verify the health endpoint and key records before resuming work.
            </li>
          </ol>
        ),
      },
      {
        heading: "No downgrade guarantee",
        body: (
          <p>
            Downgrades are not documented as supported. Keep the pre-upgrade
            application revision and backup together.
          </p>
        ),
      },
    ],
  },
  "/docs/security/": {
    eyebrow: "Documentation · Security",
    title: "Treat local v1 as an unauthenticated loopback application.",
    description:
      "The API has no user authentication and must not be directly exposed to an untrusted network.",
    sections: [
      {
        heading: "Implemented",
        body: (
          <ul>
            <li>
              Default bind to <code>127.0.0.1</code>, not <code>0.0.0.0</code>.
            </li>
            <li>OpenAPI request validation for the canonical API.</li>
            <li>
              Persistent audit events, evidence hashes, and immutable report
              snapshots.
            </li>
          </ul>
        ),
      },
      {
        heading: "Not implemented",
        body: (
          <ul>
            <li>Hosted SaaS authentication.</li>
            <li>Production multi-user RBAC.</li>
            <li>
              External verifier credentials and explicit remediator/verifier
              identity assertions.
            </li>
          </ul>
        ),
      },
    ],
  },
  "/product/": {
    eyebrow: "Product",
    title: "Persistent remediation verification, locally.",
    description:
      "Local v1 connects normalized findings, remediation, separate verification history, locked evidence, audit events, and immutable reports.",
    sections: [
      {
        heading: "Implemented",
        body: (
          <ul>
            <li>SQLite persistence and migrations.</li>
            <li>Canonical OpenAPI 3.1 API and typed web client.</li>
            <li>Retained failed verification history.</li>
            <li>Evidence metadata with SHA-256 content hashes.</li>
            <li>Immutable report snapshots and Markdown download.</li>
          </ul>
        ),
      },
      {
        heading: "Not part of local v1",
        body: (
          <p>
            Authentication, production RBAC, hosted verification workers,
            managed vendor integrations, and cloud operations are not
            implemented.
          </p>
        ),
      },
    ],
  },
  "/open-source/": {
    eyebrow: "Source and licensing",
    title: "Public source. License pending.",
    description:
      "The product source is publicly readable on GitHub, but the repository does not currently contain an explicit license.",
    sections: [
      {
        heading: "What that means",
        body: (
          <p>
            You can inspect the implementation and project history. Do not infer
            permission to copy, modify, or redistribute the product from
            repository visibility alone. This site does not select or grant a
            license.
          </p>
        ),
      },
      {
        heading: "Canonical repository",
        body: (
          <a
            className="button button-primary"
            href="https://github.com/remedence/remedence"
          >
            Inspect the source <ExternalLink aria-hidden="true" size={17} />
          </a>
        ),
      },
    ],
  },
  "/cloud/": {
    eyebrow: "Planned · Not available",
    title: "Remedence Cloud is future work.",
    description:
      "No hosted Remedence service, public pricing, launch date, or signup is currently available.",
    sections: [
      {
        heading: "Proposed direction",
        body: (
          <p>
            Managed hosting, hosted verification execution, managed
            integrations, enterprise identity, collaboration, backup, and
            MSP-scale workflows are product direction only. They are not
            implemented commitments.
          </p>
        ),
      },
      {
        heading: "Use today",
        body: (
          <p>
            The available product is local v1. Follow the public repository and
            roadmap for verified changes.
          </p>
        ),
      },
    ],
  },
  "/integrations/": {
    eyebrow: "Integrations",
    title: "A canonical import contract, not managed connectors.",
    description:
      "Local v1 can normalize imported findings through its API. Managed vendor integrations are planned, not implemented.",
    sections: [
      {
        heading: "Implemented boundary",
        body: (
          <p>
            The canonical API accepts normalized finding import data and
            preserves source context. It does not claim automatic
            synchronization with third-party products.
          </p>
        ),
      },
      {
        heading: "For integrators",
        body: (
          <p>
            Use the OpenAPI contract as the source of truth and keep the API on
            its trusted loopback boundary.
          </p>
        ),
      },
    ],
  },
  "/security/": {
    eyebrow: "Security and trust center",
    title: "Implemented controls and missing controls, side by side.",
    description:
      "Security claims here are limited to behavior visible in the current product and public-site repositories.",
    sections: [
      {
        heading: "Implemented in local v1",
        body: (
          <ul>
            <li>Loopback-only default bind.</li>
            <li>Request validation against OpenAPI.</li>
            <li>
              Persisted verification history, append-only audit events, evidence
              hashes, and immutable report snapshots.
            </li>
          </ul>
        ),
      },
      {
        heading: "Planned or unavailable",
        body: (
          <ul>
            <li>User authentication and production multi-user RBAC.</li>
            <li>
              Hosted worker isolation, managed integrations, enterprise
              identity, and cloud controls.
            </li>
            <li>
              Certifications or third-party assurance reports; none are claimed.
            </li>
          </ul>
        ),
      },
      {
        heading: "Responsible disclosure",
        body: (
          <p>
            Use the repository's{" "}
            <a href="https://github.com/remedence/remedence/security">
              GitHub Security page
            </a>{" "}
            to check for an enabled private reporting channel. If GitHub does
            not present one, do not publish sensitive exploit details in a
            public issue.
          </p>
        ),
      },
    ],
  },
  "/solutions/msps/": {
    eyebrow: "For MSPs",
    title: "Keep customer closure evidence separate from patch status.",
    description:
      "Local v1 demonstrates the evidence chain; MSP multi-tenancy and authorization are planned.",
    sections: [
      {
        heading: "Useful today",
        body: (
          <p>
            Evaluate finding normalization, remediation records, retained
            verification history, locked evidence, and immutable reporting with
            fictional demo data.
          </p>
        ),
      },
      {
        heading: "Not available",
        body: (
          <p>
            Do not treat local v1 as a multi-tenant production service. Customer
            isolation, MSP authorization, hosted operations, and QBR automation
            are not implemented.
          </p>
        ),
      },
    ],
  },
  "/solutions/security-teams/": {
    eyebrow: "For security teams",
    title: "Require verification before closure.",
    description:
      "Use the local workflow to keep remediation claims distinct from persisted verification outcomes.",
    sections: [
      {
        heading: "Evaluation path",
        body: (
          <p>
            Model a finding, record remediation, retain failed checks, pass a
            separate verification, and inspect the evidence and report
            snapshots.
          </p>
        ),
      },
    ],
  },
  "/solutions/vciso/": {
    eyebrow: "For vCISOs",
    title: "Review the chain behind a closure claim.",
    description:
      "Local v1 provides inspectable evidence and immutable report snapshots without claiming hosted client separation.",
    sections: [
      {
        heading: "Boundary",
        body: (
          <p>
            Reports are local artifacts from persisted state. Multi-client
            authorization and managed delivery are not implemented.
          </p>
        ),
      },
    ],
  },
  "/solutions/auditors/": {
    eyebrow: "For auditors",
    title: "Inspect provenance, verification, and snapshots.",
    description:
      "The product records evidence metadata, append-only audit events, and immutable report snapshots; it does not claim certification or audit acceptance.",
    sections: [
      {
        heading: "Evaluate",
        body: (
          <p>
            Review whether the captured method, scope, timestamps, result,
            evidence hash, and report snapshot meet your engagement's
            requirements.
          </p>
        ),
      },
    ],
  },
  "/solutions/integrators/": {
    eyebrow: "For integrators",
    title: "Build against the canonical API contract.",
    description:
      "The OpenAPI 3.1 document is authoritative for local v1; managed connectors and remote authentication are unavailable.",
    sections: [
      {
        heading: "Start",
        body: (
          <p>
            Inspect the interactive API reference, then run the product locally
            and keep requests on the loopback origin.
          </p>
        ),
      },
    ],
  },
  "/company/": {
    eyebrow: "Company",
    title: "A public project without invented proof.",
    description:
      "Remedence publishes implementation and architecture history in GitHub. No customer, certification, pricing, legal-entity, or availability claims are implied here.",
    sections: [
      {
        heading: "Follow verified progress",
        body: (
          <div className="link-grid">
            <a href="https://github.com/remedence/remedence">
              Product repository
            </a>
            <a href="/roadmap/">Roadmap</a>
            <a href="/changelog/">Changelog</a>
            <a href="/status/">Status</a>
          </div>
        ),
      },
    ],
  },
  "/contact/": {
    eyebrow: "Contact",
    title: "No public intake channel is configured yet.",
    description:
      "The repositories do not provide an authoritative contact email, form endpoint, waitlist, or response-time commitment.",
    sections: [
      {
        heading: "Current path",
        body: (
          <p>
            Follow the public repositories for releases and project changes. A
            contact or design-partner funnel will require an approved
            destination, consent copy, data-retention details, and realistic
            response expectations before it can collect submissions.
          </p>
        ),
      },
    ],
  },
  "/roadmap/": {
    eyebrow: "Public proof · Roadmap",
    title: "Implemented, next, and exploratory work.",
    description:
      "The roadmap distinguishes shipped local-v1 behavior from planned direction and does not promise dates.",
    sections: [
      {
        heading: "Implemented",
        body: (
          <p>
            Persistent local state, canonical API, remediation and verification
            history, locked evidence, append-only audit events, immutable
            reports, and local production serving.
          </p>
        ),
      },
      {
        heading: "Planned",
        body: (
          <p>
            First-class remediator/verifier identity boundaries, MSP
            multi-tenancy with authorization, hosted verification execution,
            managed integrations, and cross-tool orchestration.
          </p>
        ),
      },
      {
        heading: "Exploratory",
        body: (
          <p>
            Remedence Cloud operations, enterprise identity, collaboration,
            backup and support, and client automation. No availability dates are
            committed.
          </p>
        ),
      },
    ],
  },
  "/changelog/": {
    eyebrow: "Public proof · Changelog",
    title: "Use the repository history as the release record.",
    description: "No separately versioned public release feed exists yet.",
    sections: [
      {
        heading: "Verified history",
        body: (
          <p>
            Review{" "}
            <a href="https://github.com/remedence/remedence/commits/main">
              product commits
            </a>{" "}
            and{" "}
            <a href="https://github.com/remedence/remedence/releases">
              GitHub releases
            </a>
            . A release is not inferred from roadmap text.
          </p>
        ),
      },
    ],
  },
  "/status/": {
    eyebrow: "Public proof · Status",
    title: "No hosted product status is claimed.",
    description:
      "Local v1 runs on the operator's machine. Remedence Cloud is not available, so there is no Remedence service uptime to report.",
    sections: [
      {
        heading: "Public dependencies",
        body: (
          <p>
            Repository availability depends on GitHub. Website delivery depends
            on GitHub Pages. Consult{" "}
            <a href="https://www.githubstatus.com/">GitHub Status</a> for those
            services.
          </p>
        ),
      },
    ],
  },
  "/legal/privacy/": {
    eyebrow: "Policy · Privacy",
    title: "Website privacy notice.",
    description:
      "This static site does not configure analytics, advertising, accounts, forms, or cookies.",
    sections: [
      {
        heading: "Data handling",
        body: (
          <p>
            Remedence does not receive form submissions from this site because
            no form or collection endpoint is configured. GitHub Pages may
            process request data under GitHub's own terms and privacy practices.
          </p>
        ),
      },
      {
        heading: "Changes",
        body: (
          <p>
            If analytics or a contact channel is proposed later, it requires
            explicit approval, purpose and retention documentation, consent
            where applicable, and an updated notice before collection begins.
          </p>
        ),
      },
    ],
  },
  "/legal/terms/": {
    eyebrow: "Policy · Terms",
    title: "Website use terms.",
    description:
      "This page provides a narrow public-site boundary and does not identify or invent a legal entity.",
    sections: [
      {
        heading: "Informational site",
        body: (
          <p>
            Site content describes a developing product and may change. It is
            not a warranty, service-level agreement, certification, legal
            advice, or promise of future availability.
          </p>
        ),
      },
      {
        heading: "Product source",
        body: (
          <p>
            The public product repository has no explicit license. Public
            visibility alone does not grant reuse, modification, or
            redistribution rights.
          </p>
        ),
      },
    ],
  },
  "/legal/acceptable-use/": {
    eyebrow: "Policy · Acceptable use",
    title: "Use public resources lawfully and safely.",
    description:
      "Do not use Remedence resources to violate law, compromise systems without authorization, disrupt service, or publish sensitive vulnerability details.",
    sections: [
      {
        heading: "Security research",
        body: (
          <p>
            Only test systems you own or are explicitly authorized to test. Use
            an available private disclosure channel for sensitive findings.
          </p>
        ),
      },
    ],
  },
  "/legal/trademark/": {
    eyebrow: "Policy · Trademark",
    title: "Remedence names and brand assets.",
    description: "No trademark registration claim is made.",
    sections: [
      {
        heading: "Brand use",
        body: (
          <p>
            Do not imply endorsement, partnership, certification, or official
            status. The approved assets on this site are not a general license
            to reuse the Remedence name or artwork.
          </p>
        ),
      },
    ],
  },
  "/legal/cookies/": {
    eyebrow: "Policy · Cookies and analytics",
    title: "No analytics vendor is enabled.",
    description:
      "The site application does not set cookies or load analytics, advertising, session-replay, or consent-vendor scripts.",
    sections: [
      {
        heading: "Architecture",
        body: (
          <p>
            Any future measurement must be privacy-respecting, collect the
            minimum necessary data, honor consent requirements, document
            retention and access, and be approved before deployment.
          </p>
        ),
      },
    ],
  },
  "/legal/accessibility/": {
    eyebrow: "Policy · Accessibility",
    title: "Accessibility is part of release QA.",
    description:
      "The site targets keyboard operation, visible focus, reduced motion, responsive layouts, semantic structure, and automated WCAG 2.2 AA checks.",
    sections: [
      {
        heading: "Limits",
        body: (
          <p>
            Automated checks do not prove full conformance. Manual keyboard,
            zoom, screen-reader, contrast, and visual review remain part of
            release acceptance.
          </p>
        ),
      },
      {
        heading: "Feedback",
        body: (
          <p>
            No authoritative accessibility contact channel is published yet.
            That gap is tracked with the general contact-intake blocker.
          </p>
        ),
      },
    ],
  },
};

function ApiPage() {
  return (
    <Suspense fallback={<p>Loading the canonical API contract…</p>}>
      <ApiDocs />
    </Suspense>
  );
}

export default function SitePage({ path }: { path: string }) {
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  const page =
    normalizedPath === "/docs/api/"
      ? {
          eyebrow: "Documentation · API",
          title: "Canonical OpenAPI 3.1 reference.",
          description:
            "Explore the implemented local-v1 contract. Request execution is disabled on this public site.",
          sections: [{ heading: "API explorer", body: <ApiPage /> }],
        }
      : pages[normalizedPath];

  if (!page) {
    return (
      <SiteFrame>
        <main id="main-content" className="section content-page">
          <p className="eyebrow">404</p>
          <h1>Page not found.</h1>
          <p>The requested public route is not part of this release.</p>
          <a className="button button-primary" href="/">
            Return home
          </a>
        </main>
      </SiteFrame>
    );
  }

  return (
    <SiteFrame>
      <main id="main-content" className="section content-page">
        <header className="content-hero">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </header>
        <div className="content-sections">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body}
            </section>
          ))}
        </div>
      </main>
    </SiteFrame>
  );
}

function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand-link" href="/" aria-label="Remedence home">
            <img
              src="/brand/remedence-logo-primary-ui.png"
              alt="Remedence"
              width={360}
              height={120}
            />
          </a>
          <nav className="page-nav" aria-label="Primary navigation">
            <a href="/product/">Product</a>
            <a href="/get-started/">Get started</a>
            <a href="/docs/">Docs</a>
            <a href="/security/">Security</a>
            <a href="/roadmap/">Roadmap</a>
          </nav>
          <a
            className="header-github"
            href="https://github.com/remedence/remedence"
          >
            <GitBranch aria-hidden="true" size={17} />
            GitHub
          </a>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="section footer-inner">
          <a className="footer-brand" href="/" aria-label="Remedence home">
            <img
              src="/brand/remedence-logo-primary-ui.png"
              alt="Remedence"
              width={360}
              height={120}
            />
          </a>
          <p>Public source · explicit license pending.</p>
          <div className="footer-links">
            <a href="/docs/">Docs</a>
            <a href="/security/">Security</a>
            <a href="/legal/privacy/">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
