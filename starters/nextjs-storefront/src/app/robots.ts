import type { MetadataRoute } from "next";
import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.SITE_URL;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/checkout", "/order/", "/account/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/feed", "/acp", "/products/", "/collections/"],
        disallow: ["/cart", "/checkout", "/order/", "/account/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/feed", "/acp", "/products/", "/collections/"],
        disallow: ["/cart", "/checkout", "/order/", "/account/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/cart", "/checkout", "/order/", "/account/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
