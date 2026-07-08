export type CheckoutMode = "cart" | "buy-now";

interface CheckoutCartIds {
  cartId?: string;
  buyNowCartId?: string;
}

export function parseCheckoutMode(value: string | undefined): CheckoutMode {
  return value === "buy-now" ? "buy-now" : "cart";
}

export function resolveCheckoutCartId(
  mode: CheckoutMode,
  ids: CheckoutCartIds,
): string | undefined {
  return mode === "buy-now" ? ids.buyNowCartId : ids.cartId;
}
