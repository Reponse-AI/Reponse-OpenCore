import { NextResponse } from "next/server";
import { getStoreConfig } from "@/lib/config";

interface AiPluginManifest {
  schema_version: string;
  name_for_model: string;
  name_for_human: string;
  description_for_model: string;
  description_for_human: string;
  api: {
    type: string;
    url: string;
  };
  logo_url: string;
  contact_email: string;
  legal_info_url: string;
}

export async function GET(): Promise<NextResponse<AiPluginManifest>> {
  const config = await getStoreConfig();
  const storeName = config["--rp-brand-name"] || "Store";
  const logoUrl = config["--rp-brand-logo"] || "";

  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
  const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

  const manifest: AiPluginManifest = {
    schema_version: "v1",
    name_for_model: storeName,
    name_for_human: storeName,
    description_for_model:
      "E-commerce store. Use the product feed to discover products and the ACP endpoint to create purchases.",
    description_for_human: `Shop ${storeName}`,
    api: {
      type: "openapi",
      url: `${apiUrl}/v1/feed?workspace_id=${workspaceId}`,
    },
    logo_url: logoUrl,
    contact_email: "support@reponse.ai",
    legal_info_url: `${siteUrl}/policies/legal-notice`,
  };

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
