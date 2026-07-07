import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
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
