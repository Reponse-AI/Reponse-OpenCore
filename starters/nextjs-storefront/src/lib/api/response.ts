import type { ApiDataEnvelope } from "@/types/storefront";

export type SdkResult<T> = { data?: T; error?: unknown; response?: Response };

export function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function extractEnvelopeData<T>(payload: T | ApiDataEnvelope<T>): T {
  if (isObjectRecord(payload) && "data" in payload) {
    return payload.data as T;
  }
  return payload as T;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isObjectRecord(error) || !("error" in error)) return fallback;

  const apiError = error.error;
  if (typeof apiError === "string") return apiError;
  if (isObjectRecord(apiError) && typeof apiError.message === "string") {
    return apiError.message;
  }

  return fallback;
}

export async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as unknown;
  return extractEnvelopeData(payload) as T;
}

export async function readJsonResult<T>(
  response: Response,
  fallbackError: string,
): Promise<T> {
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackError));
  }

  return extractEnvelopeData(payload) as T;
}
