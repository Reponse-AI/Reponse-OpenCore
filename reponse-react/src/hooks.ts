import useSWR from 'swr';
import { useReponse } from './provider';

/* ------------------------------------------------------------------ */
/*  Catalog hooks                                                      */
/* ------------------------------------------------------------------ */

export function useProducts(params?: {
  query?: string;
  slug?: string;
  limit?: number;
  cursor?: string;
}) {
  const client = useReponse();
  return useSWR(
    ['reponse', 'products', params],
    () => client.catalog.listProducts({ query: params }),
  );
}

export function useProduct(id: string) {
  const client = useReponse();
  return useSWR(
    id ? ['reponse', 'product', id] : null,
    () => client.catalog.getProduct({ path: { id } }),
  );
}

export function useCollections(params?: { limit?: number }) {
  const client = useReponse();
  return useSWR(
    ['reponse', 'collections', params],
    () => client.catalog.listCollections({ query: params }),
  );
}

/* ------------------------------------------------------------------ */
/*  Cart hook                                                          */
/* ------------------------------------------------------------------ */

export function useCart(cartId: string | null) {
  const client = useReponse();

  const { data, error, isLoading, mutate } = useSWR(
    cartId ? ['reponse', 'cart', cartId] : null,
    () => client.cart.get({ path: { id: cartId! } }),
  );

  const addItem = async (
    productId: string,
    quantity?: number,
    variantId?: string,
  ) => {
    if (!cartId) return;
    await client.cart.addItem({
      path: { id: cartId },
      body: {
        items: [
          {
            product_id: productId,
            variant_id: variantId,
            quantity: quantity ?? 1,
          },
        ],
      },
    });
    mutate();
  };

  const updateItem = async (lineId: string, quantity: number) => {
    if (!cartId) return;
    await client.cart.updateItem({
      path: { id: cartId, lineId },
      body: { quantity },
    });
    mutate();
  };

  const removeItem = async (lineId: string) => {
    if (!cartId) return;
    await client.cart.removeItem({
      path: { id: cartId, lineId },
    });
    mutate();
  };

  return { data, error, isLoading, mutate, addItem, updateItem, removeItem };
}
