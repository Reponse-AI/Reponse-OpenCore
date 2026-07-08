export interface StorefrontRuntimeEnv {
  apiUrl: string;
  workspaceId: string;
  locale?: string;
}

type GlobalEnv = typeof globalThis & {
  __ENV?: {
    REPONSE_API_URL?: string;
    REPONSE_WORKSPACE_ID?: string;
    LOCALE?: string;
  };
};

export function getStorefrontEnv(): StorefrontRuntimeEnv {
  const runtimeEnv = (globalThis as GlobalEnv).__ENV;

  if (runtimeEnv) {
    return {
      apiUrl: runtimeEnv.REPONSE_API_URL || "https://reponse.ai/api",
      workspaceId: runtimeEnv.REPONSE_WORKSPACE_ID || "",
      locale: runtimeEnv.LOCALE,
    };
  }

  // Keep this helper client-safe: server modules should import "@/env" directly,
  // while shared modules use this narrow fallback for SSR and tests.
  return {
    apiUrl: process.env.REPONSE_API_URL || "https://reponse.ai/api",
    workspaceId: process.env.REPONSE_WORKSPACE_ID || "",
  };
}

export function getApiOrigin(apiUrl: string): string {
  return apiUrl.endsWith("/api") ? apiUrl.slice(0, -4) : apiUrl;
}
