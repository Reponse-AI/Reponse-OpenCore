import { notFound } from "next/navigation";
import Link from "next/link";
import { env } from "@/env";
import { getStoreConfig, isModuleActive } from "@/lib/config";
import { getLoyaltyProgram } from "@/lib/loyalty";
import { formatPrice } from "@/lib/currency";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata() {
  const config = await getStoreConfig();
  const title = `Rewards Program – ${config["--rp-brand-name"]}`;
  const description = "Earn points, unlock perks, and enjoy exclusive rewards every time you shop with us.";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website" as const,
    },
    twitter: {
      card: "summary" as const,
      title,
      description,
    },
  };
}

// ─── Earning Rule Icons ───────────────────────────────────────────────────────

const RULE_ICONS: Record<string, string> = {
  purchase: "🛒",
  signup: "👋",
  review: "⭐",
  referral: "🎁",
  birthday: "🎂",
  social_share: "📣",
};

function getRuleIcon(event: string): string {
  return RULE_ICONS[event] ?? "✨";
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function RewardsPage() {
  const config = await getStoreConfig();
  if (!isModuleActive(config, "loyalty")) {
    notFound();
  }

  const program = await getLoyaltyProgram();
  if (!program || !program.is_active) {
    notFound();
  }

  const brandName = config["--rp-brand-name"];
  const currency = env.MARKET_CURRENCY;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--rp-color-background)",
        color: "var(--rp-color-text)",
        fontFamily: "var(--rp-font-family)",
      }}
    >

      {/* Hero */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 24px 60px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "9999px",
            backgroundColor: "color-mix(in srgb, var(--rp-color-primary) 10%, transparent)",
            color: "var(--rp-color-primary)",
            fontSize: "13px",
            fontWeight: 600,
            marginBottom: "24px",
          }}
        >
          ✨ {program.points_name} Rewards
        </div>
        <h1
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 20px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Shop. Earn. Enjoy.
        </h1>
        <p
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            color: "var(--rp-color-text-secondary)",
            margin: "0 0 32px 0",
            maxWidth: "560px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Join the {brandName} rewards program and start earning{" "}
          <strong style={{ color: "var(--rp-color-text)" }}>
            {program.points_name}
          </strong>{" "}
          on every interaction. Redeem them for discounts on your next purchase.
        </p>

        {/* Points value callout */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 28px",
            borderRadius: "var(--rp-radius)",
            backgroundColor: "var(--rp-color-surface)",
            border: "1px solid var(--rp-color-border)",
            fontSize: "15px",
            fontWeight: 600,
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <span style={{ fontSize: "24px" }}>💰</span>
          <span>
            1 {program.points_name} ={" "}
            {formatPrice(program.points_currency_ratio, currency)}
          </span>
        </div>

        <div style={{ marginTop: "32px" }}>
          <Link
            href="/account/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "14px 32px",
              borderRadius: "var(--rp-radius)",
              backgroundColor: "var(--rp-color-primary)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            Join Now →
          </Link>
        </div>
      </section>

      {/* How to Earn */}
      {program.earning_rules.length > 0 && (
        <section
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px 64px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              textAlign: "center",
              margin: "0 0 40px 0",
              letterSpacing: "-0.01em",
            }}
          >
            How to Earn {program.points_name}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {program.earning_rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  padding: "28px 24px",
                  borderRadius: "var(--rp-radius)",
                  backgroundColor: "var(--rp-color-surface)",
                  border: "1px solid var(--rp-color-border)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "default",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                  {getRuleIcon(rule.event)}
                </div>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    color: "var(--rp-color-text)",
                  }}
                >
                  {rule.label}
                </h3>
                {rule.description && (
                  <p
                    style={{
                      fontSize: "14px",
                      color: "var(--rp-color-text-secondary)",
                      margin: "0 0 12px 0",
                      lineHeight: 1.5,
                    }}
                  >
                    {rule.description}
                  </p>
                )}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 12px",
                    borderRadius: "9999px",
                    backgroundColor:
                      "color-mix(in srgb, var(--rp-color-primary) 10%, transparent)",
                    color: "var(--rp-color-primary)",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  +{rule.points} {program.points_name}
                  {rule.multiplier && rule.multiplier > 1 && (
                    <span> (×{rule.multiplier})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tier Cards */}
      {program.tiers.length > 0 && (
        <section
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px 80px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              textAlign: "center",
              margin: "0 0 40px 0",
              letterSpacing: "-0.01em",
            }}
          >
            Membership Tiers
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {program.tiers.map((tier, i) => (
              <div
                key={tier.id}
                style={{
                  padding: "32px 24px",
                  borderRadius: "var(--rp-radius)",
                  backgroundColor: "var(--rp-color-surface)",
                  border: `2px solid ${tier.color || "var(--rp-color-border)"}`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Tier accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    backgroundColor: tier.color || "var(--rp-color-primary)",
                  }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: tier.color || "var(--rp-color-primary)",
                    marginBottom: "8px",
                  }}
                >
                  Tier {i + 1}
                </div>
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    margin: "0 0 8px 0",
                    color: "var(--rp-color-text)",
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--rp-color-text-secondary)",
                    margin: "0 0 20px 0",
                  }}
                >
                  {tier.min_points.toLocaleString()} {program.points_name}{" "}
                  required
                </p>

                {/* Multiplier */}
                {tier.multiplier > 1 && (
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      backgroundColor:
                        "color-mix(in srgb, var(--rp-color-success) 10%, transparent)",
                      color: "var(--rp-color-success)",
                      fontSize: "12px",
                      fontWeight: 700,
                      marginBottom: "16px",
                    }}
                  >
                    ×{tier.multiplier} earning multiplier
                  </div>
                )}

                {/* Perks */}
                {tier.perks.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {tier.perks.map((perk, j) => (
                      <li
                        key={j}
                        style={{
                          fontSize: "14px",
                          color: "var(--rp-color-text)",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            color: "var(--rp-color-success)",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "48px 24px 80px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            padding: "40px 32px",
            borderRadius: "var(--rp-radius)",
            backgroundColor: "var(--rp-color-surface)",
            border: "1px solid var(--rp-color-border)",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            Ready to start earning?
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--rp-color-text-secondary)",
              margin: "0 0 24px 0",
              lineHeight: 1.6,
            }}
          >
            Create your account and begin collecting {program.points_name} on
            every purchase.
          </p>
          <Link
            href="/account/login"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              borderRadius: "var(--rp-radius)",
              backgroundColor: "var(--rp-color-primary)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
