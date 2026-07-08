"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getStorefrontEnv } from "@/lib/api/env";
import { jsonHeaders, workspaceHeaders } from "@/lib/api/headers";
import { queryKeys } from "@/lib/api/query-keys";
import { readJsonResult } from "@/lib/api/response";
import type {
  AppliedGiftCard,
  LoyaltyBalance,
  LoyaltyProgram,
  RedeemResult,
} from "@/types/storefront";

export function useGiftCardRedemption() {
  return useMutation({
    mutationFn: async (code: string): Promise<AppliedGiftCard> => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const normalizedCode = code.trim().toUpperCase();
      const response = await fetch(`${apiUrl}/v1/gift-cards/redeem`, {
        method: "POST",
        headers: jsonHeaders(workspaceId),
        body: JSON.stringify({ code: normalizedCode }),
      });
      const data = await readJsonResult<{ amount?: number; balance?: number }>(
        response,
        "Invalid gift card code",
      );

      return {
        code: normalizedCode,
        amount: data.amount ?? data.balance ?? 0,
      };
    },
  });
}

export function useLoyaltyRedemption(contactId: string) {
  const program = useQuery({
    queryKey: queryKeys.loyalty.program(),
    queryFn: async () => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const response = await fetch(`${apiUrl}/v1/loyalty`, {
        headers: workspaceHeaders(workspaceId),
      });
      const data = await readJsonResult<LoyaltyProgram | { program: LoyaltyProgram }>(
        response,
        "Failed to load loyalty program",
      );
      return "program" in data ? data.program : data;
    },
  });

  const balance = useQuery({
    queryKey: queryKeys.loyalty.balance(contactId),
    enabled: Boolean(contactId),
    queryFn: async () => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const response = await fetch(`${apiUrl}/v1/loyalty?contact_id=${encodeURIComponent(contactId)}`, {
        headers: workspaceHeaders(workspaceId),
      });
      return readJsonResult<LoyaltyBalance>(response, "Failed to load loyalty balance");
    },
  });

  const redeem = useMutation({
    mutationFn: async ({ points }: { points: number }): Promise<RedeemResult> => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const response = await fetch(`${apiUrl}/v1/loyalty/redeem`, {
        method: "POST",
        headers: jsonHeaders(workspaceId),
        body: JSON.stringify({ contact_id: contactId, points }),
      });
      return readJsonResult<RedeemResult>(response, "Failed to redeem points");
    },
  });

  return { program, balance, redeem };
}

export function useConfirmOrder() {
  return useMutation({
    mutationFn: async ({
      apiUrl,
      apiKey,
      cartId,
      paymentIntentId,
      customerEmail,
      customerName,
      shippingAddress,
      marketId,
    }: {
      apiUrl: string;
      apiKey: string;
      cartId: string;
      paymentIntentId: string;
      customerEmail: string;
      customerName: string;
      shippingAddress: Record<string, string> | null;
      marketId: string;
    }) => {
      const response = await fetch(`${apiUrl}/v1/orders/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          cart_id: cartId,
          payment_intent_id: paymentIntentId,
          customer_email: customerEmail,
          customer_name: customerName,
          shipping_address: shippingAddress,
          market_id: marketId,
        }),
      });
      return readJsonResult<unknown>(response, "Failed to confirm order");
    },
  });
}
