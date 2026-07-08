import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { type Locale, parseLocale, getDictionary, LOCALE_COOKIE } from "@/lib/i18n";
import { env } from "@/env";

export const metadata: Metadata = {
  title: "Product Feed",
  description:
    "Machine-readable product data for AI agents and integrations. Access JSON and CSV feeds for automated product discovery.",
};

async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (localeCookie) return parseLocale(localeCookie);
  const headersList = await headers();
  return parseLocale(headersList.get("accept-language") || "");
}

export default async function FeedPage() {
  const locale = await resolveLocale();
  const dict = await getDictionary(locale);

  const apiUrl = env.REPONSE_API_URL;
  const workspaceId = env.REPONSE_WORKSPACE_ID;

  const jsonFeedUrl = `${apiUrl}/v1/feed?workspace_id=${workspaceId}`;
  const csvFeedUrl = `${apiUrl}/v1/feed?workspace_id=${workspaceId}&format=csv`;

  function t(key: string, fallback: string): string {
    return dict[key] ?? fallback;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">

      <main className="flex-grow max-w-3xl w-full mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            {t("common.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">
            {t("feed.title", "Product Feed")}
          </span>
        </nav>

        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          {t("feed.title", "Product Feed")}
        </h1>
        <p className="text-gray-500 text-lg mb-10 leading-relaxed">
          {t("feed.description", "Machine-readable product data for AI agents and integrations.")}
        </p>

        {/* Feed endpoints */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          {/* JSON Feed */}
          <a
            href={jsonFeedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 24,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              textDecoration: "none",
              color: "inherit",
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}
            className="hover:shadow-md hover:border-gray-300"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f0f9ff",
                  color: "#0284c7",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {"{ }"}
              </span>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                {t("feed.jsonFeed", "JSON Feed")}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Structured JSON with products, variants, prices, and images.
            </p>
            <code
              style={{
                fontSize: 11,
                color: "#9ca3af",
                wordBreak: "break-all",
                marginTop: 4,
              }}
            >
              GET /v1/feed?workspace_id=...
            </code>
          </a>

          {/* CSV Feed */}
          <a
            href={csvFeedUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: 24,
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              textDecoration: "none",
              color: "inherit",
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}
            className="hover:shadow-md hover:border-gray-300"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "#f0fdf4",
                  color: "#16a34a",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                CSV
              </span>
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                {t("feed.csvFeed", "CSV Feed")}
              </span>
            </div>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
              Flat CSV export for spreadsheets, data pipelines, and batch imports.
            </p>
            <code
              style={{
                fontSize: 11,
                color: "#9ca3af",
                wordBreak: "break-all",
                marginTop: 4,
              }}
            >
              GET /v1/feed?workspace_id=...&format=csv
            </code>
          </a>
        </div>

        {/* How it works */}
        <div
          style={{
            padding: 24,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 12,
              color: "#111827",
            }}
          >
            {t("feed.howItWorks", "How it works")}
          </h2>
          <p
            style={{
              fontSize: 14,
              color: "#4b5563",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {t(
              "feed.howItWorksText",
              "AI agents can discover and query our full product catalog through standardized feed endpoints. The feed includes product titles, descriptions, prices, availability, variants, and images.",
            )}
          </p>
        </div>

        {/* Link to ACP */}
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/acp"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Learn about ACP →
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t("nav.catalog", "Catalog")}
          </Link>
        </div>
      </main>
    </div>
  );
}
