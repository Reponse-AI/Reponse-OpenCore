import { describe, expect, it } from "vitest";
import { calculateCheckoutTotal, mapCartItemsForCheckout } from "./totals";
import type { StorefrontCart } from "@/types/storefront";

describe("checkout totals", () => {
  it("never returns a negative total", () => {
    expect(calculateCheckoutTotal({ subtotal: 10, discountAmount: 15, shippingCost: 2 })).toBe(0);
  });

  it("maps enriched cart items into checkout summary rows", () => {
    const cart: StorefrontCart = {
      id: "cart_1",
      items: [
        {
          id: "line_1",
          product_id: "prod_1",
          variant_id: "var_1",
          variant_title: "Blue / Large",
          has_only_one_variant: false,
          quantity: 2,
          price: 8,
          product: {
            id: "prod_1",
            title: "Tee",
            handle: "tee",
            images: ["https://example.com/tee.jpg"],
          },
        },
      ],
      subtotal: 16,
      currency: "EUR",
    };

    expect(mapCartItemsForCheckout(cart)).toEqual([
      {
        id: "line_1",
        title: "Tee",
        variant_title: "Blue / Large",
        has_only_one_variant: false,
        quantity: 2,
        unit_price: 8,
        line_price: 16,
        image_url: "https://example.com/tee.jpg",
      },
    ]);
  });

  it("preserves a missing variant title", () => {
    const cart: StorefrontCart = {
      id: "cart_1",
      items: [
        {
          id: "line_1",
          product_id: "prod_1",
          variant_id: null,
          variant_title: null,
          has_only_one_variant: true,
          quantity: 1,
          price: 8,
          product: {
            id: "prod_1",
            title: "Tee",
            handle: "tee",
            images: [],
          },
        },
      ],
      subtotal: 8,
      currency: "EUR",
    };

    expect(mapCartItemsForCheckout(cart)[0]).toMatchObject({
      variant_title: null,
      has_only_one_variant: true,
    });
  });
});
