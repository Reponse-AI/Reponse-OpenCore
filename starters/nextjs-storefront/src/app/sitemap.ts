import type { MetadataRoute } from "next";
import type { Product } from "@reponseai/sdk";
import { reponse } from "@/lib/reponse";

export const revalidate = 3600;

/** The list endpoint returns collections with a `handle` field not present on the base SDK `Collection` type. */
interface CollectionWithHandle {
  id: string;
  title: string;
  handle?: string | null;
  description: string | null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/rewards`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/track`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/feed`, lastModified: now, changeFrequency: "weekly", priority: 0.3 },
    { url: `${siteUrl}/acp`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Product pages
  try {
    const response = await reponse.catalog.listProducts({ query: { limit: 50 } });
    const products: Product[] = response.data?.data ?? [];
    const productPages = products
      .filter((p): p is Product & { slug: string } => p.slug !== null)
      .map((p) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    staticPages.push(...productPages);
  } catch { /* SDK or network error — skip product pages */ }

  // Collection pages
  try {
    const response = await reponse.catalog.listCollections();
    const collections = (response.data?.data ?? []) as CollectionWithHandle[];
    const collectionPages = collections
      .filter((c): c is CollectionWithHandle & { handle: string } => !!c.handle)
      .map((c) => ({
        url: `${siteUrl}/collections/${c.handle}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    staticPages.push(...collectionPages);
  } catch { /* SDK or network error — skip collection pages */ }

  return staticPages;
}
