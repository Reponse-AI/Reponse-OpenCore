"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  addToCart,
  getCartSummary,
  removeCartItem,
  updateCartItem,
} from "@/lib/cart";
import {
  optimisticallyAddItem,
  optimisticallyRemoveItem,
  optimisticallyUpdateItem,
  type OptimisticAddInput,
} from "@/lib/cart-optimistic";
import { queryKeys } from "@/lib/api/query-keys";
import type { CartSummary } from "@/types/storefront";

interface UpdateItemInput {
  lineId: string;
  quantity: number;
}

interface CartContextValue {
  cart: CartSummary | null;
  itemCount: number;
  isLoading: boolean;
  addItem: UseMutationResult<CartSummary, Error, OptimisticAddInput>;
  updateItem: UseMutationResult<CartSummary | null, Error, UpdateItemInput>;
  removeItem: UseMutationResult<CartSummary | null, Error, string>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const cartQuery = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCartSummary,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const addItem = useMutation({
    mutationFn: ({
      productId,
      variantId,
      quantity,
    }: OptimisticAddInput) => addToCart(productId, variantId, quantity),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previous =
        queryClient.getQueryData<CartSummary | null>(queryKeys.cart.all);
      queryClient.setQueryData(
        queryKeys.cart.all,
        optimisticallyAddItem(previous, input),
      );
      return { previous };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(queryKeys.cart.all, context?.previous ?? null);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.all, cart);
    },
  });

  const updateItem = useMutation({
    mutationFn: ({ lineId, quantity }: UpdateItemInput) =>
      updateCartItem(lineId, quantity),
    onMutate: async ({ lineId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previous =
        queryClient.getQueryData<CartSummary | null>(queryKeys.cart.all);
      if (previous) {
        queryClient.setQueryData(
          queryKeys.cart.all,
          optimisticallyUpdateItem(previous, lineId, quantity),
        );
      }
      return { previous };
    },
    onError: (_error, _input, context) => {
      queryClient.setQueryData(queryKeys.cart.all, context?.previous ?? null);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.all, cart);
    },
  });

  const removeItem = useMutation({
    mutationFn: removeCartItem,
    onMutate: async (lineId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const previous =
        queryClient.getQueryData<CartSummary | null>(queryKeys.cart.all);
      if (previous) {
        queryClient.setQueryData(
          queryKeys.cart.all,
          optimisticallyRemoveItem(previous, lineId),
        );
      }
      return { previous };
    },
    onError: (_error, _lineId, context) => {
      queryClient.setQueryData(queryKeys.cart.all, context?.previous ?? null);
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(queryKeys.cart.all, cart);
    },
  });

  return (
    <CartContext.Provider
      value={{
        cart: cartQuery.data ?? null,
        itemCount: cartQuery.data?.item_count ?? 0,
        isLoading: cartQuery.isLoading,
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
