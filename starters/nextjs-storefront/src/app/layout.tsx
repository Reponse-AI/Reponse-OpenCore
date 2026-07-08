import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { QueryProvider } from "@/components/QueryProvider";
import { getStoreConfig, themeToStyleVars } from "@/lib/config";
import { type Locale, defaultLocale, parseLocale, getDictionary, LOCALE_COOKIE } from "@/lib/i18n";
import { env } from "@/env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Resolve locale from cookie or Accept-Language header. */
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (localeCookie) return parseLocale(localeCookie);

  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";
  return parseLocale(acceptLang);
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig();
  const storeName = config["--rp-brand-name"] || "Reponse Store";

  return {
    title: { default: storeName, template: `%s | ${storeName}` },
    description:
      "The official Reponse demo store — headless commerce, powered by AI",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getStoreConfig();
  const styleVars = themeToStyleVars(config);
  const storeName = config["--rp-brand-name"] || "Store";

  const locale = await resolveLocale();
  const dict = await getDictionary(locale);

  const siteUrl = env.SITE_URL;
  const apiUrl = env.REPONSE_API_URL;
  const workspaceId = env.REPONSE_WORKSPACE_ID;

  // ─── JSON-LD: Organization ─────────────────────────────────────────────────
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: config["--rp-brand-name"] || "Store",
    url: siteUrl,
    ...(config["--rp-brand-logo"] ? { logo: config["--rp-brand-logo"] } : {}),
  };

  // ─── JSON-LD: WebSite (enables Google sitelinks search box) ────────────────
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config["--rp-brand-name"] || "Store",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={styleVars}
    >
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {/* Product feed discovery links */}
        {workspaceId && (
          <link
            rel="alternate"
            type="application/json"
            title="Product Feed (JSON)"
            href={`${apiUrl}/v1/feed?workspace_id=${workspaceId}`}
          />
        )}
        {workspaceId && (
          <link
            rel="alternate"
            type="text/csv"
            title="Product Feed (CSV)"
            href={`${apiUrl}/v1/feed/csv?workspace_id=${workspaceId}`}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        {/* Runtime env injection — allows client components to read server-only vars */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV=${JSON.stringify({
              REPONSE_API_URL: env.REPONSE_API_URL,
              REPONSE_WORKSPACE_ID: env.REPONSE_WORKSPACE_ID,
              LOCALE: locale,
            })}`,
          }}
        />
        <QueryProvider>
          {children}
          <Footer storeName={storeName} dict={dict} />
        </QueryProvider>
        {env.REPONSE_WORKSPACE_ID && (
          <Script
            src="https://reponse.ai/assets/sdk/reponse-widget.min.js"
            data-reponse-workspace-id={env.REPONSE_WORKSPACE_ID}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
