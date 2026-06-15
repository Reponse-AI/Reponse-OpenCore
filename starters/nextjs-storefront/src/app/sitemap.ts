import type { MetadataRoute } from "next";
import { reponse } from "@/lib/reponse";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/cart`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.3 },
  ];

  // Product pages
  try {
    const response = await reponse.catalog.listProducts({ query: { limit: 50 } });
    const products = response.data?.data ?? [];
    const productPages = products
      .filter((p: any) => p.slug)
      .map((p: any) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    staticPages.push(...productPages);
  } catch {}

  // Collection pages
  try {
    const response = await reponse.catalog.listCollections();
    const collections = response.data?.data ?? [];
    const collectionPages = collections
      .filter((c: any) => c.handle)
      .map((c: any) => ({
        url: `${siteUrl}/collections/${c.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    staticPages.push(...collectionPages);
  } catch {}

  return staticPages;
}
