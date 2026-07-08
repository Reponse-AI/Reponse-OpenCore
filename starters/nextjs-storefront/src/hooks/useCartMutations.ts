"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  addToCart,
  applyPromoCode,
  removeCartItem,
  removePromoCode,
  updateCartItem,
} from "@/lib/cart";
import { queryKeys } from "@/lib/api/query-keys";

export function useCartMutations() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const invalidateCart = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    router.refresh();
  };

  return {
    addItem: useMutation({
      mutationFn: ({
        productId,
        variantId,
        quantity = 1,
      }: {
        productId: string;
        variantId?: string;
        quantity?: number;
      }) => addToCart(productId, variantId, quantity),
      onSuccess: invalidateCart,
    }),
    updateItem: useMutation({
      mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) =>
        updateCartItem(lineId, quantity),
      onSuccess: invalidateCart,
    }),
    removeItem: useMutation({
      mutationFn: (lineId: string) => removeCartItem(lineId),
      onSuccess: invalidateCart,
    }),
    applyPromoCode: useMutation({
      mutationFn: (code: string) => applyPromoCode(code),
      onSuccess: invalidateCart,
    }),
    removePromoCode: useMutation({
      mutationFn: (code: string) => removePromoCode(code),
      onSuccess: invalidateCart,
    }),
  };
}
