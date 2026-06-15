import { Metadata } from "next";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_REPONSE_API_URL || "https://api.reponse.ai";
const API_KEY = process.env.REPONSE_API_KEY || "";

interface PolicyData {
  policy_type: string;
  title: string;
  body: string;
  locale: string;
  slug: string;
  updated_at: string;
}

async function fetchPolicy(type: string): Promise<PolicyData | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/policies/${type}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: PolicyData };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const policy = await fetchPolicy(type);
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Store";

  return {
    title: policy ? `${policy.title} — ${storeName}` : `Policy — ${storeName}`,
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const policy = await fetchPolicy(type);

  if (!policy) {
    return (
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "80px 24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-block",
            marginBottom: 32,
            fontSize: 14,
            color: "#6b7280",
            textDecoration: "none",
          }}
        >
          ← Back to store
        </Link>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#111827" }}>
          Policy not found
        </h1>
        <p style={{ color: "#6b7280", marginTop: 16 }}>
          The requested policy page does not exist or has not been published yet.
        </p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "80px 24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Link
        href="/"
        style={{
          display: "inline-block",
          marginBottom: 32,
          fontSize: 14,
          color: "#6b7280",
          textDecoration: "none",
        }}
      >
        ← Back to store
      </Link>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 8,
        }}
      >
        {policy.title}
      </h1>

      {policy.updated_at && (
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            fontStyle: "italic",
            marginBottom: 40,
          }}
        >
          Last updated:{" "}
          {new Date(policy.updated_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}

      <article
        style={{
          color: "#374151",
          lineHeight: 1.75,
          fontSize: 16,
        }}
        dangerouslySetInnerHTML={{ __html: policy.body }}
      />
    </main>
  );
}
