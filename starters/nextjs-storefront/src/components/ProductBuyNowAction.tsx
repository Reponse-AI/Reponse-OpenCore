"use client";

import { BuyNowButton } from "@/components/BuyNowButton";
import { useBuyNow } from "@/hooks/useBuyNow";

interface ProductBuyNowActionProps {
  productId: string;
  variantId?: string;
  disabled?: boolean;
}

export function ProductBuyNowAction({
  productId,
  variantId,
  disabled = false,
}: ProductBuyNowActionProps) {
  const { startBuyNow, isPending, error } = useBuyNow();

  return (
    <div>
      <BuyNowButton
        disabled={disabled}
        isPending={isPending}
        onClick={() => startBuyNow({ productId, variantId })}
        size="compact"
      />
      {error && (
        <p className="mt-1 text-center text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
