import type { CheckoutSummaryItem, StorefrontCart } from "@/types/storefront";

export function calculateCheckoutTotal({
  subtotal,
  discountAmount,
  shippingCost,
}: {
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
}): number {
  return Math.max(0, subtotal - discountAmount + shippingCost);
}

export function mapCartItemsForCheckout(cart: StorefrontCart): CheckoutSummaryItem[] {
  return cart.items.map((item) => {
    const title = item.product?.title || "";
    return {
      id: item.id,
      title,
      variant_title: item.variant_title ?? null,
      quantity: item.quantity || 1,
      unit_price: item.product?.id ? item.price : item.price,
      line_price: item.price * (item.quantity || 1),
      image_url: item.product?.images?.[0] || "",
    };
  });
}
