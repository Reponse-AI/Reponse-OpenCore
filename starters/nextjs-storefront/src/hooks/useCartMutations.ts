"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  applyPromoCode,
  removePromoCode,
} from "@/lib/cart";
import { queryKeys } from "@/lib/api/query-keys";
import { useCart } from "@/components/CartProvider";

export function useCartMutations() {
  const queryClient = useQueryClient();
  const { addItem, updateItem, removeItem } = useCart();

  const invalidateCart = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
  };

  return {
    addItem,
    updateItem,
    removeItem,
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
