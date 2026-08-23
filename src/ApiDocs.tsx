import { useEffect, useMemo, useState } from "react";

type Operation = {
  operationId?: string;
  summary?: string;
  description?: string;
  responses?: Record<string, { description?: string }>;
};

type OpenApiDocument = {
  info: { title: string; version: string; description?: string };
  paths: Record<string, Record<string, Operation>>;
};

const httpMethods = new Set(["get", "post", "put", "patch", "delete"]);

export default function ApiDocs() {
  const [document, setDocument] = useState<OpenApiDocument | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/openapi.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Contract returned ${response.status}`);
        return response.json() as Promise<OpenApiDocument>;
      })
      .then(setDocument)
      .catch((reason: unknown) => {
        if ((reason as { name?: string }).name !== "AbortError") {
          setError(
            reason instanceof Error ? reason.message : "Contract unavailable",
          );
        }
      });
    return () => controller.abort();
  }, []);

  const operations = useMemo(() => {
    if (!document) return [];
    return Object.entries(document.paths).flatMap(([path, pathItem]) =>
      Object.entries(pathItem)
        .filter(([method]) => httpMethods.has(method))
        .map(([method, operation]) => ({ path, method, operation })),
    );
  }, [document]);

  const filtered = operations.filter(({ path, method, operation }) =>
    `${method} ${path} ${operation.summary ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <div className="api-docs">
      <aside className="trust-boundary" aria-label="API authentication status">
        <strong>Authentication is unavailable in local v1.</strong>
        <span>
          The API binds to <code>127.0.0.1</code>. Request execution is disabled
          because this public site must not call a visitor's local service.
          Production authentication and RBAC are planned.
        </span>
      </aside>
      {error && <p role="alert">Could not load the contract: {error}</p>}
      {!document && !error && (
        <p role="status">Loading the canonical API contract…</p>
      )}
      {document && (
        <>
          <div className="api-reference-heading">
            <div>
              <h3>{document.info.title}</h3>
              <p>
                Contract version {document.info.version} · {operations.length}{" "}
                operations
              </p>
            </div>
            <label>
              Filter operations
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
              />
            </label>
          </div>
          <div className="operation-list" aria-live="polite">
            {filtered.map(({ path, method, operation }) => (
              <details key={`${method}-${path}`}>
                <summary>
                  <span className={`method method-${method}`}>
                    {method.toUpperCase()}
                  </span>
                  <code>{path}</code>
                  <span>{operation.summary}</span>
                </summary>
                <div className="operation-detail">
                  {operation.description && <p>{operation.description}</p>}
                  {operation.operationId && (
                    <p>
                      <strong>Operation ID:</strong>{" "}
                      <code>{operation.operationId}</code>
                    </p>
                  )}
                  <p>
                    <strong>Responses:</strong>{" "}
                    {Object.keys(operation.responses ?? {}).join(", ") ||
                      "Not declared"}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
