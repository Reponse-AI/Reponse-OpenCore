"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { buyNow } from "@/lib/buy-now.actions";

interface BuyNowInput {
  productId: string;
  variantId?: string;
}

export function useBuyNow() {
  const router = useRouter();
  const requestInFlight = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const startBuyNow = useCallback(
    ({ productId, variantId }: BuyNowInput) => {
      if (requestInFlight.current) return;

      requestInFlight.current = true;
      setError(null);
      startTransition(async () => {
        try {
          const result = await buyNow(productId, variantId);
          if (!result.success) {
            setError(result.error);
            return;
          }
          router.push("/checkout?mode=buy-now");
        } catch (error: unknown) {
          setError(
            error instanceof Error ? error.message : "Unable to start checkout",
          );
        } finally {
          requestInFlight.current = false;
        }
      });
    },
    [router],
  );

  return { startBuyNow, isPending, error };
}
