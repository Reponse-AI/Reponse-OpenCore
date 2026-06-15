// src/provider.tsx
import { createContext, useContext, useMemo } from "react";
import { Reponse } from "@reponseai/sdk";
import { jsx } from "react/jsx-runtime";
var ReponseContext = createContext(null);
function ReponseProvider({
  children,
  ...options
}) {
  const client = useMemo(
    () => new Reponse(options),
    [options.apiKey, options.baseUrl]
  );
  return /* @__PURE__ */ jsx(ReponseContext.Provider, { value: client, children });
}
function useReponse() {
  const client = useContext(ReponseContext);
  if (!client) {
    throw new Error("useReponse must be used within a <ReponseProvider>");
  }
  return client;
}

// src/hooks.ts
import useSWR from "swr";
function useProducts(params) {
  const client = useReponse();
  return useSWR(
    ["reponse", "products", params],
    () => client.catalog.listProducts({ query: params })
  );
}
function useProduct(id) {
  const client = useReponse();
  return useSWR(
    id ? ["reponse", "product", id] : null,
    () => client.catalog.getProduct({ path: { id } })
  );
}
function useCollections(params) {
  const client = useReponse();
  return useSWR(
    ["reponse", "collections", params],
    () => client.catalog.listCollections({ query: params })
  );
}
function useCart(cartId) {
  const client = useReponse();
  const { data, error, isLoading, mutate } = useSWR(
    cartId ? ["reponse", "cart", cartId] : null,
    () => client.cart.get({ path: { id: cartId } })
  );
  const addItem = async (productId, quantity, variantId) => {
    if (!cartId) return;
    await client.cart.addItem({
      path: { id: cartId },
      body: {
        items: [
          {
            product_id: productId,
            variant_id: variantId,
            quantity: quantity ?? 1
          }
        ]
      }
    });
    mutate();
  };
  const updateItem = async (lineId, quantity) => {
    if (!cartId) return;
    await client.cart.updateItem({
      path: { id: cartId, lineId },
      body: { quantity }
    });
    mutate();
  };
  const removeItem = async (lineId) => {
    if (!cartId) return;
    await client.cart.removeItem({
      path: { id: cartId, lineId }
    });
    mutate();
  };
  return { data, error, isLoading, mutate, addItem, updateItem, removeItem };
}
export {
  ReponseProvider,
  useCart,
  useCollections,
  useProduct,
  useProducts,
  useReponse
};
