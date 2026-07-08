"use server";

// ─── Orders Data Fetcher ──────────────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

import type { Order } from "@/types/storefront";
import { env } from "@/env";

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;

// ─── Types ────────────────────────────────────────────────────────────────────

export type { Order, OrderAddress, OrderFulfillment, OrderLineItem } from "@/types/storefront";

// ─── Fetchers ─────────────────────────────────────────────────────────────────

export async function getOrdersByContact(
  contactId: string
): Promise<Order[]> {
  try {
    const { getSessionToken } = await import("./auth");
    const token = await getSessionToken();
    const headers: Record<string, string> = { "x-workspace-id": workspaceId };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${apiUrl}/v1/orders?contact_id=${encodeURIComponent(contactId)}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) return [];
    const data = (await res.json()) as Record<string, unknown>;
    const orders = data.orders;
    return Array.isArray(orders) ? (orders as Order[]) : [];
  } catch {
    return [];
  }
}

export async function lookupOrder(
  email: string,
  orderNumber: string
): Promise<Order | null> {
  try {
    const params = new URLSearchParams({
      email,
      order_number: orderNumber,
    });
    const res = await fetch(`${apiUrl}/v1/orders/lookup?${params}`, {
      headers: { "x-workspace-id": workspaceId },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as Order;
  } catch {
    return null;
  }
}

export async function cancelOrder(orderId: string): Promise<boolean> {
  try {
    const { getSessionToken } = await import("./auth");
    const token = await getSessionToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-workspace-id": workspaceId,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${apiUrl}/v1/orders/${orderId}/cancel`, {
      method: "POST",
      headers,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function resendOrderConfirmation(
  orderId: string
): Promise<boolean> {
  try {
    const { getSessionToken } = await import("./auth");
    const token = await getSessionToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-workspace-id": workspaceId,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${apiUrl}/v1/orders/${orderId}/resend-confirmation`,
      {
        method: "POST",
        headers,
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function getOrder(
  orderId: string,
  contactId: string
): Promise<Order | null> {
  try {
    const { getSessionToken } = await import("./auth");
    const token = await getSessionToken();
    const headers: Record<string, string> = { "x-workspace-id": workspaceId };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${apiUrl}/v1/orders/${encodeURIComponent(orderId)}?contact_id=${encodeURIComponent(contactId)}`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!res.ok) return null;
    return (await res.json()) as Order;
  } catch {
    return null;
  }
}

export async function resendInvoice(orderId: string): Promise<boolean> {
  try {
    const { getSessionToken } = await import("./auth");
    const token = await getSessionToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-workspace-id": workspaceId,
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(
      `${apiUrl}/v1/orders/${orderId}/resend-invoice`,
      {
        method: "POST",
        headers,
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
