"use server";

import { createBuyNowCart } from "@/lib/cart";

export type BuyNowResult =
  | { success: true }
  | { success: false; error: string };

export async function buyNow(
  productId: string,
  variantId?: string,
): Promise<BuyNowResult> {
  try {
    await createBuyNowCart(productId, variantId);
    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to start checkout",
    };
  }
}
