import { redirect, notFound } from "next/navigation";
import { getContactId } from "@/lib/auth";
import { getStoreConfig, isModuleActive } from "@/lib/config";
import { getLoyaltyProgram, getReferralInfo } from "@/lib/loyalty";
import { ReferralActions } from "./ReferralActions";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Referral Program",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AccountReferralPage() {
  const config = await getStoreConfig();
  if (!isModuleActive(config, "loyalty")) {
    notFound();
  }

  const contactId = await getContactId();
  if (!contactId) {
    redirect("/account/login");
  }

  const program = await getLoyaltyProgram();
  if (!program || !program.is_active || !program.referral_enabled) {
    notFound();
  }

  const referral = await getReferralInfo(contactId);

  if (!referral) {
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
          Referral Program
        </h1>
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            borderRadius: "var(--rp-radius)",
            backgroundColor: "var(--rp-color-surface)",
            border: "1px solid var(--rp-color-border)",
            fontFamily: "var(--rp-font-family)",
          }}
        >
          <p
            style={{
              fontSize: "15px",
              color: "var(--rp-color-text-secondary)",
              margin: 0,
            }}
          >
            Referral information is not available at the moment.
          </p>
        </div>
      </div>
    );
  }

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
        Referral Program
      </h1>

      {/* Share Section */}
      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 8px 0",
            color: "var(--rp-color-text)",
          }}
        >
          Share & Earn
        </h2>
        <p
          style={{
            fontSize: "14px",
            color: "var(--rp-color-text-secondary)",
            margin: "0 0 20px 0",
            lineHeight: 1.5,
          }}
        >
          Invite friends to shop with us. When they make their first purchase,
          you both earn {program.points_name}!
        </p>

        {/* Referral Code */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--rp-color-text-secondary)",
              marginBottom: "6px",
            }}
          >
            Your Referral Code
          </label>
          <ReferralActions
            code={referral.referral_code}
            url={referral.referral_url}
          />
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--rp-color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            {referral.stats.pending}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--rp-color-text-secondary)",
              marginTop: "4px",
            }}
          >
            Pending
          </div>
        </div>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--rp-color-success)",
              letterSpacing: "-0.02em",
            }}
          >
            {referral.stats.converted}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--rp-color-text-secondary)",
              marginTop: "4px",
            }}
          >
            Converted
          </div>
        </div>
        <div style={{ ...cardStyle, textAlign: "center" }}>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              color: "var(--rp-color-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {referral.stats.total_earned.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--rp-color-text-secondary)",
              marginTop: "4px",
            }}
          >
            {program.points_name} Earned
          </div>
        </div>
      </div>
    </div>
  );
}
