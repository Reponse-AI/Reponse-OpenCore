import { getStoreConfig } from "@/lib/config";
import { SupportForm } from "./SupportForm";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata() {
  const config = await getStoreConfig();
  const title = `Support – ${config["--rp-brand-name"]}`;
  const description = "Need help? Contact our support team and we'll get back to you as soon as possible.";
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SupportPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--rp-color-background)",
        color: "var(--rp-color-text)",
        fontFamily: "var(--rp-font-family)",
      }}
    >

      <div
        style={{
          maxWidth: "640px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            margin: "0 0 12px 0",
            letterSpacing: "-0.02em",
          }}
        >
          Contact Support
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--rp-color-text-secondary)",
            margin: "0 0 36px 0",
            lineHeight: 1.5,
          }}
        >
          Have a question or need help? Fill out the form below and our team
          will get back to you.
        </p>

        <SupportForm />
      </div>
    </div>
  );
}
