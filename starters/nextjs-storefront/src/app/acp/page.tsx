import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { Header } from "@/components/Header";
import { type Locale, parseLocale, getDictionary, LOCALE_COOKIE } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Agentic Commerce Protocol (ACP)",
  description:
    "Learn how AI agents can discover products, create carts, and complete purchases through the Agentic Commerce Protocol.",
};

async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (localeCookie) return parseLocale(localeCookie);
  const headersList = await headers();
  return parseLocale(headersList.get("accept-language") || "");
}

export default async function AcpPage() {
  const locale = await resolveLocale();
  const dict = await getDictionary(locale);

  const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
  const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

  function t(key: string, fallback: string): string {
    return dict[key] ?? fallback;
  }

  const steps = [
    { num: "1", text: t("acp.step1", "The AI agent discovers products via the product feed.") },
    { num: "2", text: t("acp.step2", "It creates a cart and adds items using the Cart API.") },
    { num: "3", text: t("acp.step3", "It initiates checkout via the ACP checkout endpoint.") },
    { num: "4", text: t("acp.step4", "Payment is handled securely through Stripe.") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />

      <main className="flex-grow max-w-3xl w-full mx-auto px-8 py-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            {t("common.home", "Home")}
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">
            {t("acp.title", "Agentic Commerce Protocol")}
          </span>
        </nav>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            {t("acp.title", "Agentic Commerce Protocol")}
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            {t("acp.subtitle", "Let AI agents buy on your behalf")}
          </p>
        </div>

        {/* What is ACP? */}
        <section
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
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 12,
              color: "#111827",
            }}
          >
            {t("acp.whatIsAcp", "What is ACP?")}
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "#4b5563",
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {t(
              "acp.whatIsAcpText",
              "The Agentic Commerce Protocol (ACP) enables AI agents — like ChatGPT, Claude, or custom assistants — to discover products, add items to a cart, and complete purchases programmatically through our headless API.",
            )}
          </p>
        </section>

        {/* How it works */}
        <section
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
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              color: "#111827",
            }}
          >
            {t("acp.howItWorks", "How it works")}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#111",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </span>
                <p
                  style={{
                    fontSize: 15,
                    color: "#4b5563",
                    lineHeight: 1.6,
                    margin: 0,
                    paddingTop: 4,
                  }}
                >
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* API Endpoints */}
        <section
          style={{
            padding: 24,
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 16,
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              color: "#111827",
            }}
          >
            API Endpoints
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                method: "GET",
                path: "/v1/feed",
                desc: "Product feed (JSON/CSV)",
                color: "#16a34a",
              },
              {
                method: "GET",
                path: "/v1/products",
                desc: "List & search products",
                color: "#16a34a",
              },
              {
                method: "POST",
                path: "/v1/carts",
                desc: "Create a cart",
                color: "#2563eb",
              },
              {
                method: "POST",
                path: "/v1/carts/:id/items",
                desc: "Add items to cart",
                color: "#2563eb",
              },
              {
                method: "POST",
                path: "/v1/checkout/acp",
                desc: "ACP checkout",
                color: "#2563eb",
              },
            ].map((ep) => (
              <div
                key={ep.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: "1px solid #f3f4f6",
                }}
              >
                <code
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: ep.color,
                    background: `${ep.color}11`,
                    padding: "2px 6px",
                    borderRadius: 4,
                    minWidth: 40,
                    textAlign: "center",
                  }}
                >
                  {ep.method}
                </code>
                <code
                  style={{
                    fontSize: 13,
                    color: "#374151",
                    fontWeight: 500,
                  }}
                >
                  {ep.path}
                </code>
                <span
                  style={{
                    fontSize: 13,
                    color: "#9ca3af",
                    marginLeft: "auto",
                  }}
                >
                  {ep.desc}
                </span>
              </div>
            ))}
          </div>
          {workspaceId && (
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginTop: 16,
                marginBottom: 0,
              }}
            >
              Base URL:{" "}
              <code style={{ fontSize: 11, color: "#6b7280" }}>
                {apiUrl}
              </code>
              {" · "}Workspace:{" "}
              <code style={{ fontSize: 11, color: "#6b7280" }}>
                {workspaceId}
              </code>
            </p>
          )}
        </section>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link
            href="/feed"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
          >
            View Product Feed →
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t("nav.catalog", "Catalog")}
          </Link>
          <a
            href="https://reponse.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            {t("acp.learnMore", "Learn more")} ↗
          </a>
        </div>
      </main>
    </div>
  );
}
