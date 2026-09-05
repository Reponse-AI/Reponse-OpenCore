import type { CartSummary, CartSummaryItem } from "@/types/storefront";

export interface OptimisticAddInput {
  productId: string;
  variantId?: string;
  quantity: number;
  price?: number;
  currency?: string;
  /**
   * Display metadata supplied by the caller so a freshly added line can render
   * complete (image, title) before the enriched cart comes back.
   */
  title?: string | null;
  handle?: string | null;
  imageUrl?: string | null;
  variantTitle?: string | null;
}

type CartDisplayFields = Pick<
  CartSummaryItem,
  "title" | "handle" | "image_url" | "variant_title"
>;

function displayFieldsFrom(input: OptimisticAddInput): CartDisplayFields {
  return {
    title: input.title ?? null,
    handle: input.handle ?? null,
    image_url: input.imageUrl ?? null,
    variant_title: input.variantTitle ?? null,
  };
}

function variantKey(item: Pick<CartSummaryItem, "product_id" | "variant_id">) {
  return `${item.product_id}:${item.variant_id ?? ""}`;
}

/**
 * Cart mutation responses only carry line amounts, so replacing the cache with
 * one would blank out every image and title. Re-apply the display metadata we
 * already hold for each line before the server payload takes over.
 */
export function withPreservedItemDisplay(
  previous: CartSummary | null | undefined,
  next: CartSummary,
): CartSummary {
  if (!previous) return next;

  const byLineId = new Map(previous.items.map((item) => [item.id, item]));
  const byVariant = new Map(
    previous.items.map((item) => [variantKey(item), item]),
  );

  return {
    ...next,
    items: next.items.map((item) => {
      if (item.title) return item;
      const known = byLineId.get(item.id) ?? byVariant.get(variantKey(item));
      if (!known?.title) return item;

      return {
        ...item,
        title: known.title,
        handle: known.handle,
        image_url: known.image_url,
        variant_title: known.variant_title,
      };
    }),
  };
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
          ...displayFieldsFrom(input),
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
            ...displayFieldsFrom(input),
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
