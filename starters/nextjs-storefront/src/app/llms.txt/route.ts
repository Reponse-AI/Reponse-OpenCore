import { NextResponse } from "next/server";
import { getStoreConfig } from "@/lib/config";

export async function GET(): Promise<NextResponse> {
  const config = await getStoreConfig();
  const storeName = config["--rp-brand-name"] || "Store";

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
  const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

  const body = `# ${storeName}

> An e-commerce store powered by Reponse.

## Product Discovery
- Product catalog: ${siteUrl}/products
- Product feed (JSON): ${apiUrl}/v1/feed?workspace_id=${workspaceId}
- Product feed (CSV): ${apiUrl}/v1/feed/csv?workspace_id=${workspaceId}

## Shopping
- Browse products: ${siteUrl}/products?q={query}
- Product details: ${siteUrl}/products/{slug}
- Collections: ${siteUrl}/collections

## Agentic Commerce (ACP)
- ACP checkout endpoint: ${apiUrl}/v1/checkout/acp
- ACP documentation: ${siteUrl}/acp

## SEO Feeds
- Google Merchant Center: ${apiUrl}/api/seo/merchant-center/${workspaceId}
- Facebook: ${apiUrl}/api/seo/facebook/${workspaceId}
- Pinterest: ${apiUrl}/api/seo/pinterest/${workspaceId}
- TikTok: ${apiUrl}/api/seo/tiktok/${workspaceId}
- Snapchat: ${apiUrl}/api/seo/snapchat/${workspaceId}
`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
