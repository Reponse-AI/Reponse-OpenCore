// ─── Support Tickets Data Fetcher ─────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

import { getSessionToken } from "./auth";
import type { CreateTicketData, CreateTicketResult, ReplyResult, Ticket } from "@/types/storefront";
import { env } from "@/env";

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;

export type { CreateTicketData, CreateTicketResult, ReplyResult, Ticket, TicketNote } from "@/types/storefront";

// ─── Fetchers ─────────────────────────────────────────────────────────────────

/** Fetch tickets for a customer email. */
export async function getTickets(email: string): Promise<Ticket[]> {
  const token = await getSessionToken();

  try {
    const headers: Record<string, string> = {
      "x-workspace-id": workspaceId,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${apiUrl}/v1/tickets?customer_email=${encodeURIComponent(email)}`,
      { headers, cache: "no-store" }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

/** Fetch a single ticket by ID. */
export async function getTicket(ticketId: string): Promise<Ticket | null> {
  const token = await getSessionToken();

  try {
    const headers: Record<string, string> = {
      "x-workspace-id": workspaceId,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrl}/v1/tickets/${encodeURIComponent(ticketId)}`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as Ticket;
  } catch {
    return null;
  }
}

/** Create a new support ticket. */
export async function createTicket(
  data: CreateTicketData
): Promise<CreateTicketResult> {
  try {
    const res = await fetch(`${apiUrl}/v1/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-workspace-id": workspaceId,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        error: result.error || "Failed to create ticket",
      };
    }

    return {
      success: true,
      id: result.id,
      status: result.status,
    };
  } catch {
    return { success: false, error: "Failed to create ticket" };
  }
}

/** Reply to an existing ticket. */
export async function replyToTicket(
  ticketId: string,
  message: string
): Promise<ReplyResult> {
  const token = await getSessionToken();

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-workspace-id": workspaceId,
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `${apiUrl}/v1/tickets/${encodeURIComponent(ticketId)}/reply`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ message }),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Failed to send reply" }));
      return { success: false, error: data.error || "Failed to send reply" };
    }

    return { success: true };
  } catch {
    return { success: false, error: "Failed to send reply" };
  }
}
