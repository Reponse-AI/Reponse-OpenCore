"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import type { CartSummary } from "@/types/storefront";

export function CartHydrator({ cart }: { cart: CartSummary | null }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.setQueryData(queryKeys.cart.all, cart);
  }, [cart, queryClient]);

  return null;
}
