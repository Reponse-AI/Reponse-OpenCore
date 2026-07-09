import type { CartSummary } from "@/types/storefront";

export interface OptimisticAddInput {
  productId: string;
  variantId?: string;
  quantity: number;
  price?: number;
  currency?: string;
}

function getOptimisticAmounts(cart: CartSummary, subtotal: number) {
  return {
    subtotal,
    adjusted_total:
      cart.adjusted_total === undefined
        ? undefined
        : Math.max(0, subtotal - (cart.discount_total ?? 0)),
  };
}

export function optimisticallyAddItem(
  cart: CartSummary | null | undefined,
  input: OptimisticAddInput,
): CartSummary {
  const quantity = input.quantity;
  const existing = cart?.items.find(
    (item) =>
      item.product_id === input.productId &&
      item.variant_id === (input.variantId ?? null),
  );
  const price = input.price ?? existing?.price ?? 0;

  if (!cart) {
    return {
      id: "optimistic",
      item_count: quantity,
      subtotal: price * quantity,
      currency: input.currency ?? "EUR",
      items: [
        {
          id: `optimistic:${input.productId}:${input.variantId ?? "default"}`,
          product_id: input.productId,
          variant_id: input.variantId ?? null,
          quantity,
          price,
        },
      ],
    };
  }

  return {
    ...cart,
    item_count: cart.item_count + quantity,
    ...getOptimisticAmounts(cart, cart.subtotal + price * quantity),
    items: existing
      ? cart.items.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      : [
          ...cart.items,
          {
            id: `optimistic:${input.productId}:${input.variantId ?? "default"}`,
            product_id: input.productId,
            variant_id: input.variantId ?? null,
            quantity,
            price,
          },
        ],
  };
}

export function optimisticallyUpdateItem(
  cart: CartSummary,
  lineId: string,
  quantity: number,
): CartSummary {
  const line = cart.items.find((item) => item.id === lineId);
  if (!line) return cart;
  if (quantity === 0) return optimisticallyRemoveItem(cart, lineId);

  const quantityDelta = quantity - line.quantity;
  return {
    ...cart,
    item_count: cart.item_count + quantityDelta,
    ...getOptimisticAmounts(
      cart,
      cart.subtotal + quantityDelta * line.price,
    ),
    items: cart.items.map((item) =>
      item.id === lineId ? { ...item, quantity } : item,
    ),
  };
}

export function optimisticallyRemoveItem(
  cart: CartSummary,
  lineId: string,
): CartSummary {
  const line = cart.items.find((item) => item.id === lineId);
  if (!line) return cart;

  return {
    ...cart,
    item_count: cart.item_count - line.quantity,
    ...getOptimisticAmounts(
      cart,
      cart.subtotal - line.quantity * line.price,
    ),
    items: cart.items.filter((item) => item.id !== lineId),
  };
}
