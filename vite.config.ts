import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFile } from "node:fs/promises";
import { parse } from "yaml";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "openapi-json-development-route",
      configureServer(server) {
        server.middlewares.use("/openapi.json", async (_request, response) => {
          try {
            const contract = await readFile("public/openapi.yaml", "utf8");
            response.setHeader(
              "Content-Type",
              "application/json; charset=utf-8",
            );
            response.end(JSON.stringify(parse(contract)));
          } catch {
            response.statusCode = 500;
            response.end("OpenAPI contract unavailable");
          }
        });
      },
    },
  ],
  build: {
    manifest: true,
  },
});
