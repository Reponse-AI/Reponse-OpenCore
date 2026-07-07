"use server";

import { cookies } from "next/headers";

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_COOKIE = "reponse_session";
const CONTACT_COOKIE = "reponse_contact_id";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthenticatedContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  lifecycle_stage: string | null;
}

// ─── Session cookie helpers ───────────────────────────────────────────────────

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getContactId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CONTACT_COOKIE)?.value ?? null;
}

export async function setSession(
  token: string,
  contactId: string
): Promise<void> {
  const cookieStore = await cookies();
  const opts = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  };

  cookieStore.set({ name: SESSION_COOKIE, value: token, ...opts });
  cookieStore.set({ name: CONTACT_COOKIE, value: contactId, ...opts });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(CONTACT_COOKIE);
}

// ─── API helpers ──────────────────────────────────────────────────────────────

export async function getAuthenticatedContact(): Promise<AuthenticatedContact | null> {
  const token = await getSessionToken();
  if (!token) return null;

  const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";

  try {
    const res = await fetch(`${apiUrl}/v1/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return (await res.json()) as AuthenticatedContact;
  } catch {
    return null;
  }
}
