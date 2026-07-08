import { Reponse, client } from "@reponseai/sdk";
import { getStorefrontEnv } from "@/lib/api/env";

const { apiUrl, workspaceId } = getStorefrontEnv();

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
