"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ObfuscatedLink } from "@/components/seo/ObfuscatedLink";
import { subscribeNewsletter } from "@/lib/newsletter";

type SubscribeStatus = "idle" | "loading" | "success" | "error";

interface FooterProps {
  storeName?: string;
  dict?: Record<string, string>;
}

/** Helper: translate a key or fall back to a default. */
function t(dict: Record<string, string> | undefined, key: string, fallback: string): string {
  return dict?.[key] ?? fallback;
}

export function Footer({ storeName = "Store", dict }: FooterProps) {
  const year = new Date().getFullYear();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscribeStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const policyLinks = [
    { labelKey: "footer.privacyPolicy", fallback: "Privacy Policy", href: "/policies/privacy-policy" },
    { labelKey: "footer.termsOfService", fallback: "Terms of Service", href: "/policies/terms-of-service" },
    { labelKey: "footer.refundPolicy", fallback: "Refund Policy", href: "/policies/refund-policy" },
    { labelKey: "footer.shippingPolicy", fallback: "Shipping Policy", href: "/policies/shipping-policy" },
    { labelKey: "footer.legalNotice", fallback: "Legal Notice", href: "/policies/legal-notice" },
  ];

  // Read env for feed link. The SSR pass must resolve the same values as the
  // client (__ENV), otherwise the feed link renders only on one side and
  // hydration fails.
  const env = typeof window !== "undefined"
    ? ((globalThis as unknown as { __ENV?: { REPONSE_API_URL?: string; REPONSE_WORKSPACE_ID?: string } }).__ENV ?? {})
    : { REPONSE_API_URL: process.env.REPONSE_API_URL, REPONSE_WORKSPACE_ID: process.env.REPONSE_WORKSPACE_ID };
  const apiUrl = env.REPONSE_API_URL || "https://reponse.ai/api";
  const workspaceId = env.REPONSE_WORKSPACE_ID || "";

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const result = await subscribeNewsletter(email.trim());
      if (!result.success) {
        throw new Error(result.error || "Subscription failed");
      }

      setStatus("success");
      setEmail("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setErrorMessage(message);
      setStatus("error");
    }
  }

  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "32px 24px",
        marginTop: 64,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "center",
        }}
      >
        {/* Newsletter opt-in */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <p
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
              margin: 0,
            }}
          >
            {t(dict, "footer.stayInTheLoop", "Stay in the loop")}
          </p>
          <p
            style={{
              fontSize: 13,
              color: "#6b7280",
              margin: 0,
              textAlign: "center",
            }}
          >
            {t(dict, "footer.subscribeText", "Subscribe for updates, new arrivals, and exclusive offers.")}
          </p>

          {status === "success" ? (
            <p
              style={{
                fontSize: 13,
                color: "#16a34a",
                fontWeight: 500,
                margin: "4px 0 0",
              }}
            >
              {t(dict, "footer.subscribed", "✓ You're subscribed!")}
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{
                display: "flex",
                gap: 8,
                width: "100%",
                marginTop: 4,
              }}
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: 13,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  outline: "none",
                  backgroundColor: "#f9fafb",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  padding: "8px 16px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  backgroundColor: "#111",
                  border: "none",
                  borderRadius: 8,
                  cursor:
                    status === "loading" ? "not-allowed" : "pointer",
                  opacity: status === "loading" ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {status === "loading" ? "…" : t(dict, "footer.subscribe", "Subscribe")}
              </button>
            </form>
          )}

          {status === "error" && errorMessage && (
            <p
              style={{
                fontSize: 12,
                color: "#dc2626",
                margin: "2px 0 0",
              }}
            >
              {errorMessage}
            </p>
          )}
        </div>

        {/* Help links */}
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          <Link
            href="/track"
            style={{
              fontSize: 13,
              color: "#374151",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t(dict, "footer.trackOrder", "Track Order")}
          </Link>
          <Link
            href="/support"
            style={{
              fontSize: 13,
              color: "#374151",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t(dict, "footer.support", "Support")}
          </Link>
          <Link
            href="/rewards"
            style={{
              fontSize: 13,
              color: "#374151",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            {t(dict, "footer.rewards", "Rewards")}
          </Link>
        </nav>

        {/* Policy links */}
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {policyLinks.map((link) => (
            <ObfuscatedLink
              key={link.href}
              to={link.href}
              ariaLabel={t(dict, link.labelKey, link.fallback)}
              style={{
                fontSize: 13,
                color: "#6b7280",
                textDecoration: "none",
              }}
            >
              {t(dict, link.labelKey, link.fallback)}
            </ObfuscatedLink>
          ))}
        </nav>

        {/* For AI Agents — feed link */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#9ca3af",
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {t(dict, "footer.forAiAgents", "For AI Agents")}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link
              href="/feed"
              style={{
                fontSize: 12,
                color: "#9ca3af",
                textDecoration: "none",
              }}
            >
              {t(dict, "footer.productFeed", "Product Feed")}
            </Link>
            <span style={{ fontSize: 10, color: "#d1d5db" }}>·</span>
            <Link
              href="/acp"
              style={{
                fontSize: 12,
                color: "#9ca3af",
                textDecoration: "none",
              }}
            >
              ACP
            </Link>
            {workspaceId && (
              <>
                <span style={{ fontSize: 10, color: "#d1d5db" }}>·</span>
                <a
                  href={`${apiUrl}/v1/feed?workspace_id=${workspaceId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    color: "#9ca3af",
                    textDecoration: "none",
                  }}
                >
                  JSON ↗
                </a>
              </>
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          © {year} {storeName}. {t(dict, "footer.allRightsReserved", "All rights reserved.")}
        </p>
      </div>
    </footer>
  );
}
