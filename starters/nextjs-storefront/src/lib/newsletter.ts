"use server";

// ─── Newsletter Subscriber Action ─────────────────────────────────────────────
// Server action that proxies the subscriber capture call, adding the API key
// that the client doesn't have access to.

const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";
const apiKey = process.env.REPONSE_API_KEY || "";

interface SubscribeResult {
  success: boolean;
  error?: string;
}

export async function subscribeNewsletter(email: string): Promise<SubscribeResult> {
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
