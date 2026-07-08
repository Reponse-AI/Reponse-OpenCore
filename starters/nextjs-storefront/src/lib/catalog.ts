import type {
  CollectionDetail,
  CollectionProductsResponse,
  Product,
} from "@reponseai/sdk";
import { reponse } from "@/lib/reponse";
import type { StorefrontProduct } from "@/types/storefront";

type ProductQuery = Record<string, string | number | boolean | undefined>;

interface ProductListResult {
  data: StorefrontProduct[];
  next_cursor: string | null;
  has_more: boolean;
}

export async function listProducts(
  query: ProductQuery,
): Promise<ProductListResult> {
  const response = await reponse.catalog.listProducts({ query });
  const payload = response.data as
    | {
        data?: StorefrontProduct[];
        next_cursor?: string | null;
        has_more?: boolean;
      }
    | undefined;

  return {
    data: payload?.data ?? [],
    next_cursor: payload?.next_cursor ?? null,
    has_more: payload?.has_more ?? false,
  };
}

export async function getProductBySlug(
  slug: string,
): Promise<StorefrontProduct | null> {
  const response = await reponse.catalog.listProducts({ query: { slug } });
  return (response.data?.data?.[0] as StorefrontProduct | undefined) ?? null;
}

export async function listCollections() {
  const response = await reponse.catalog.listCollections();
  return response.data?.data ?? [];
}

export async function getCollection(
  handle: string,
): Promise<CollectionDetail | null> {
  const response = await reponse.catalog.getCollection({
    path: { handle },
  });
  return response.data?.data ?? null;
}

export async function getCollectionProducts(
  handle: string,
): Promise<CollectionProductsResponse> {
  const response = await reponse.catalog.getCollectionProducts({
    path: { handle },
    query: { limit: 50 },
  });
  return response.data ?? { products: [], total: 0, limit: 50, offset: 0 };
}

export async function listLatestProducts(limit: number): Promise<Product[]> {
  const result = await listProducts({ limit });
  return result.data as Product[];
}
