import { redirect, notFound } from "next/navigation";
import { getContactId } from "@/lib/auth";
import { getStoreConfig, isModuleActive } from "@/lib/config";
import { getLoyaltyProgram, getLoyaltyBalance } from "@/lib/loyalty";
import { formatPrice } from "@/lib/currency";
import { RedeemPoints } from "@/components/RedeemPoints";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: "My Rewards",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AccountRewardsPage() {
  const config = await getStoreConfig();
  if (!isModuleActive(config, "loyalty")) {
    notFound();
  }

  const contactId = await getContactId();
  if (!contactId) {
    redirect("/account/login");
  }

  const [program, balance] = await Promise.all([
    getLoyaltyProgram(),
    getLoyaltyBalance(contactId),
  ]);

  if (!program || !program.is_active) {
    notFound();
  }

  const currency = process.env.MARKET_CURRENCY || "EUR";

  // Calculate tier progress
  let nextTier: (typeof program.tiers)[number] | null = null;
  let progressPercent = 100;
  if (balance && program.tiers.length > 0) {
    const sortedTiers = [...program.tiers].sort(
      (a, b) => a.min_points - b.min_points
    );
    nextTier =
      sortedTiers.find((t) => t.min_points > balance.points_earned_total) ??
      null;
    if (nextTier) {
      const currentTierMin = balance.tier?.min_points ?? 0;
      const range = nextTier.min_points - currentTierMin;
      const earned = balance.points_earned_total - currentTierMin;
      progressPercent = range > 0 ? Math.min(100, Math.round((earned / range) * 100)) : 100;
    }
  }

  // Styles
  const cardStyle: React.CSSProperties = {
    padding: "24px",
    borderRadius: "var(--rp-radius)",
    backgroundColor: "var(--rp-color-surface)",
    border: "1px solid var(--rp-color-border)",
    fontFamily: "var(--rp-font-family)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--rp-color-text-secondary)",
    fontWeight: 500,
    marginBottom: "4px",
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
        My Rewards
      </h1>

      {!balance ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}>
          <p
            style={{
              fontSize: "15px",
              color: "var(--rp-color-text-secondary)",
              margin: 0,
            }}
          >
            No rewards data available yet. Start shopping to earn{" "}
            {program.points_name}!
          </p>
        </div>
      ) : (
        <>
          {/* Balance Overview Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {/* Points Balance */}
            <div style={cardStyle}>
              <div style={labelStyle}>Available {program.points_name}</div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--rp-color-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {balance.points_balance.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--rp-color-text-secondary)",
                  marginTop: "4px",
                }}
              >
                Worth{" "}
                {formatPrice(balance.currency_value, currency)}
              </div>
            </div>

            {/* Total Earned */}
            <div style={cardStyle}>
              <div style={labelStyle}>Total Earned</div>
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--rp-color-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                {balance.points_earned_total.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--rp-color-text-secondary)",
                  marginTop: "4px",
                }}
              >
                {program.points_name} lifetime
              </div>
            </div>

            {/* Current Tier */}
            <div style={cardStyle}>
              <div style={labelStyle}>Current Tier</div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: balance.tier?.color || "var(--rp-color-text)",
                }}
              >
                {balance.tier?.name || "Member"}
              </div>
              {balance.tier?.multiplier && balance.tier.multiplier > 1 && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    backgroundColor:
                      "color-mix(in srgb, var(--rp-color-success) 10%, transparent)",
                    color: "var(--rp-color-success)",
                    fontSize: "12px",
                    fontWeight: 600,
                    marginTop: "6px",
                  }}
                >
                  ×{balance.tier.multiplier} multiplier
                </div>
              )}
            </div>
          </div>

          {/* Tier Progress */}
          {nextTier && (
            <div style={{ ...cardStyle, marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--rp-color-text)",
                  }}
                >
                  Progress to {nextTier.name}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--rp-color-text-secondary)",
                  }}
                >
                  {balance.points_earned_total.toLocaleString()} /{" "}
                  {nextTier.min_points.toLocaleString()} {program.points_name}
                </span>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "9999px",
                  backgroundColor: "var(--rp-color-background)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: "100%",
                    borderRadius: "9999px",
                    backgroundColor:
                      nextTier.color || "var(--rp-color-primary)",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--rp-color-text-secondary)",
                  marginTop: "8px",
                }}
              >
                {(nextTier.min_points - balance.points_earned_total).toLocaleString()}{" "}
                {program.points_name} until {nextTier.name}
              </div>
            </div>
          )}

          {/* Redeem Points */}
          <div style={{ marginBottom: "24px" }}>
            <RedeemPoints
              contactId={contactId}
              pointsBalance={balance.points_balance}
              pointsName={program.points_name}
              pointsCurrencyRatio={program.points_currency_ratio}
              currency={currency}
            />
          </div>

          {/* How Points Work */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                margin: "0 0 16px 0",
                color: "var(--rp-color-text)",
              }}
            >
              How Your Points Work
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "var(--rp-color-text-secondary)" }}>
                  Points value
                </span>
                <span style={{ fontWeight: 600 }}>
                  1 {program.points_name} ={" "}
                  {formatPrice(program.points_currency_ratio, currency)}
                </span>
              </div>
              {program.earning_rules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--rp-color-text-secondary)" }}>
                    {rule.label}
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "var(--rp-color-primary)",
                    }}
                  >
                    +{rule.points} {program.points_name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
