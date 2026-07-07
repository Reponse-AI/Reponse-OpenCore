import { Reponse, client } from "@reponseai/sdk";

// ─── Resolve env vars (works on both server and client) ─────────────────────
// Server: reads from process.env (server-only vars, available at runtime)
// Client: reads from window.__ENV (injected by layout.tsx at render time)
const isServer = typeof window === "undefined";

const env = isServer
  ? {
      REPONSE_WORKSPACE_ID: process.env.REPONSE_WORKSPACE_ID || "",
      REPONSE_API_URL: process.env.REPONSE_API_URL || "https://reponse.ai/api",
    }
  : (((globalThis as Record<string, unknown>).__ENV as Record<string, string> | undefined) ?? {
      REPONSE_WORKSPACE_ID: "",
      REPONSE_API_URL: "https://reponse.ai/api",
    });

const workspaceId: string = env.REPONSE_WORKSPACE_ID;
const apiUrl: string = env.REPONSE_API_URL;

// Initialize SDK — uses x-workspace-id for public auth (no Bearer token).
export const reponse = new Reponse({
  apiKey: "_unused_",
  baseUrl: apiUrl,
});

// Override: replace ALL headers with just x-workspace-id.
client.interceptors.request.use((request) => {
  request.headers.set("x-workspace-id", workspaceId);
  request.headers.delete("Authorization");
  return request;
});
