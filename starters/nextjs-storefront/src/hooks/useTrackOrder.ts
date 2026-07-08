"use client";

import { useMutation } from "@tanstack/react-query";
import { getStorefrontEnv } from "@/lib/api/env";
import { workspaceHeaders } from "@/lib/api/headers";
import { readJsonResult } from "@/lib/api/response";
import type { OrderLookupResult } from "@/types/storefront";

export function useTrackOrder() {
  return useMutation({
    mutationFn: async ({ email, orderNumber }: { email: string; orderNumber: string }) => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const params = new URLSearchParams({ email, order_number: orderNumber });
      const response = await fetch(`${apiUrl}/v1/orders/lookup?${params}`, {
        headers: workspaceHeaders(workspaceId),
      });

      if (response.status === 404) {
        throw new Error("Order not found. Please check your email and order number.");
      }

      return readJsonResult<OrderLookupResult>(response, "Something went wrong. Please try again.");
    },
  });
}
