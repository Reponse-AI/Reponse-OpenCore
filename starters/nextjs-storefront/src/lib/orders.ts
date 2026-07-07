"use server";

// ─── Orders Data Fetcher ──────────────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderLineItem {
  id: string;
  product_id: string;
  variant_id: string | null;
  title: string;
  variant_title: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  image_url: string | null;
  sku: string | null;
}

export interface OrderAddress {
  first_name: string | null;
  last_name: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phone: string | null;
}

export interface OrderFulfillment {
  id: string;
  status: string;
  tracking_number: string | null;
  tracking_url: string | null;
  tracking_company: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string | null;
  status: string;
  financial_status: string;
  fulfillment_status: string | null;
  currency: string;
  subtotal_price: number;
  total_tax: number;
  total_shipping: number;
  total_discounts: number;
  total_price: number;
  line_items: OrderLineItem[];
  shipping_address: OrderAddress | null;
  billing_address: OrderAddress | null;
  fulfillments: OrderFulfillment[];
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  cancel_reason: string | null;
  note: string | null;
  contact_id: string | null;
  email: string | null;
}

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
