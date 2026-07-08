import { describe, expect, it } from "vitest";
import {
  optimisticallyAddItem,
  optimisticallyRemoveItem,
  optimisticallyUpdateItem,
} from "./cart-optimistic";
import type { CartSummary } from "@/types/storefront";

const cart: CartSummary = {
  id: "cart-1",
  item_count: 2,
  subtotal: 20,
  currency: "EUR",
  items: [
    {
      id: "line-1",
      product_id: "product-1",
      variant_id: "variant-1",
      quantity: 2,
      price: 10,
    },
  ],
};

describe("optimistic cart updates", () => {
  it("increments an existing matching line", () => {
    expect(
      optimisticallyAddItem(cart, {
        productId: "product-1",
        variantId: "variant-1",
        quantity: 1,
      }),
    ).toMatchObject({
      item_count: 3,
      subtotal: 30,
      items: [{ quantity: 3 }],
    });
  });

  it("updates quantity totals and removes a line", () => {
    const updated = optimisticallyUpdateItem(cart, "line-1", 1);
    expect(updated).toMatchObject({ item_count: 1, subtotal: 10 });
    expect(optimisticallyRemoveItem(updated, "line-1")).toMatchObject({
      item_count: 0,
      subtotal: 0,
      items: [],
    });
  });
});
