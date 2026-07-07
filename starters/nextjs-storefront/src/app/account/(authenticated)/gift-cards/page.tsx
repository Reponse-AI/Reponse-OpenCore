import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getContactId, getSessionToken } from "@/lib/auth";
import { formatPrice } from "@/lib/currency";
import { getStoreConfig, isModuleActive } from "@/lib/config";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: "My Gift Cards",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface GiftCard {
  id: string;
  code: string;
  balance: number;
  initial_value: number;
  currency: string;
  status: "active" | "disabled" | "depleted";
  expires_at: string | null;
  created_at: string;
}

// ─── Data fetcher ─────────────────────────────────────────────────────────────

async function getGiftCards(contactId: string): Promise<GiftCard[]> {
  const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
  const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";
  const token = await getSessionToken();
  if (!token) return [];

  try {
    const res = await fetch(
      `${apiUrl}/v1/gift-cards?contact_id=${encodeURIComponent(contactId)}`,
      {
        headers: {
          "x-workspace-id": workspaceId,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data.data ?? [];
  } catch {
    return [];
  }
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "active":
      return {
        bg: "color-mix(in srgb, var(--rp-color-success) 10%, transparent)",
        text: "var(--rp-color-success)",
      };
    case "depleted":
      return {
        bg: "color-mix(in srgb, var(--rp-color-text-secondary) 10%, transparent)",
        text: "var(--rp-color-text-secondary)",
      };
    case "disabled":
      return {
        bg: "color-mix(in srgb, var(--rp-color-error) 10%, transparent)",
        text: "var(--rp-color-error)",
      };
    default:
      return {
        bg: "var(--rp-color-background)",
        text: "var(--rp-color-text-secondary)",
      };
  }
}

function maskCode(code: string): string {
  if (code.length <= 4) return code;
  return "••••" + code.slice(-4);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AccountGiftCardsPage() {
  const config = await getStoreConfig();
  if (!isModuleActive(config, 'gift_cards')) notFound();

  const contactId = await getContactId();
  if (!contactId) {
    redirect("/account/login");
  }

  const giftCards = await getGiftCards(contactId);

  const cardStyle: React.CSSProperties = {
    padding: "24px",
    borderRadius: "var(--rp-radius)",
    backgroundColor: "var(--rp-color-surface)",
    border: "1px solid var(--rp-color-border)",
    fontFamily: "var(--rp-font-family)",
  };

  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: 700,
          margin: "0 0 24px 0",
          fontFamily: "var(--rp-font-family)",
          color: "var(--rp-color-text)",
        }}
      >
        Gift Cards
      </h1>

      {giftCards.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}>
          <div
            style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.4 }}
          >
            🎁
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "var(--rp-color-text-secondary)",
              margin: "0 0 4px 0",
            }}
          >
            No gift cards yet
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--rp-color-text-secondary)",
              margin: 0,
            }}
          >
            Gift cards applied to your account will appear here.
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {giftCards.map((gc) => {
            const colors = statusColor(gc.status);
            return (
              <div key={gc.id} style={cardStyle}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: "var(--rp-color-text)",
                        fontFamily: "monospace",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {maskCode(gc.code)}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--rp-color-text-secondary)",
                        marginTop: "4px",
                      }}
                    >
                      Added{" "}
                      {new Date(gc.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      backgroundColor: colors.bg,
                      color: colors.text,
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {gc.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--rp-color-text-secondary)",
                      }}
                    >
                      Remaining Balance
                    </div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: 800,
                        color:
                          gc.status === "active"
                            ? "var(--rp-color-success)"
                            : "var(--rp-color-text-secondary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {formatPrice(gc.balance, gc.currency)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--rp-color-text-secondary)",
                      }}
                    >
                      Original Value
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--rp-color-text)",
                      }}
                    >
                      {formatPrice(gc.initial_value, gc.currency)}
                    </div>
                  </div>
                </div>

                {gc.expires_at && (
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "12px",
                      color: "var(--rp-color-text-secondary)",
                    }}
                  >
                    Expires{" "}
                    {new Date(gc.expires_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
