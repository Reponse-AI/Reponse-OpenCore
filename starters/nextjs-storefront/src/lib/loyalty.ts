// ─── Loyalty & Referral Data Fetcher ──────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

import { getSessionToken } from "./auth";
import type {
  LoyaltyBalance,
  LoyaltyProgram,
  RedeemResult,
  ReferralInfo,
} from "@/types/storefront";
import { env } from "@/env";

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;

export type {
  LoyaltyBalance,
  LoyaltyEarningRule,
  LoyaltyProgram,
  LoyaltyTier,
  RedeemResult,
  ReferralInfo,
} from "@/types/storefront";

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/** Fetch public program config (no auth needed). */
export async function getLoyaltyProgram(): Promise<LoyaltyProgram | null> {
  try {
    const res = await fetch(`${apiUrl}/v1/loyalty`, {
      headers: { "x-workspace-id": workspaceId },
      next: { revalidate: 300 },
    });

    if (!res.ok) return null;
    const raw = await res.json();
    // apiSuccess wraps in { data: ... }
    const envelope = raw.data ?? raw;
    // The API returns { program: {...}, tiers: [...], earning_rules: [...] }
    // We merge into a single LoyaltyProgram object for the frontend.
    const program = envelope.program ?? envelope;
    return {
      ...program,
      tiers: envelope.tiers ?? [],
      earning_rules: (envelope.earning_rules ?? []).map(
        (r: { id: string; event: string; points_fixed: number | null; points_per_currency: number | null; max_per_customer: number | null; is_active: boolean | null }) => ({
          id: r.id,
          event: r.event,
          points: r.points_fixed ?? 0,
          label: r.event,
          description: null,
          multiplier: r.points_per_currency,
        }),
      ),
    } as LoyaltyProgram;
  } catch {
    return null;
  }
}

/** Fetch authenticated loyalty balance for a contact. */
export async function getLoyaltyBalance(
  contactId: string
): Promise<LoyaltyBalance | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `${apiUrl}/v1/loyalty?contact_id=${encodeURIComponent(contactId)}`,
      {
        headers: {
          "x-workspace-id": workspaceId,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    return (await res.json()) as LoyaltyBalance;
  } catch {
    return null;
  }
}

/** Redeem loyalty points. Server action. */
export async function redeemPoints(
  contactId: string,
  points: number,
  orderId?: string
): Promise<RedeemResult> {
  const token = await getSessionToken();
  if (!token) return { success: false, error: "Not authenticated" };

  try {
    const res = await fetch(`${apiUrl}/v1/loyalty/redeem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-workspace-id": workspaceId,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contact_id: contactId,
        points,
        ...(orderId ? { order_id: orderId } : {}),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to redeem points" };
    }

    return {
      success: true,
      points_redeemed: data.points_redeemed ?? points,
      currency_value: data.currency_value,
    };
  } catch {
    return { success: false, error: "Failed to redeem points" };
  }
}

/** Fetch referral info for an authenticated contact. */
export async function getReferralInfo(
  contactId: string
): Promise<ReferralInfo | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `${apiUrl}/v1/loyalty/referral?contact_id=${encodeURIComponent(contactId)}`,
      {
        headers: {
          "x-workspace-id": workspaceId,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    return (await res.json()) as ReferralInfo;
  } catch {
    return null;
  }
}
