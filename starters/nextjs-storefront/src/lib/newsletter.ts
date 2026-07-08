"use server";

// ─── Newsletter Subscriber Action ─────────────────────────────────────────────
// Server action that proxies the subscriber capture call, adding the API key
// that the client doesn't have access to.

import { env } from "@/env";
import type { ActionResult } from "@/types/storefront";

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;
const apiKey = env.REPONSE_API_KEY;

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  if (!email.trim()) {
    return { success: false, error: "Email is required" };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const res = await fetch(`${apiUrl}/subscribers/capture`, {
      method: "POST",
      headers,
      body: JSON.stringify({ workspaceId, email: email.trim() }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as { error?: string };
      return { success: false, error: data.error || "Subscription failed" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong" };
  }
}
