import { describe, expect, it } from "vitest";
import { queryKeys } from "./query-keys";

describe("queryKeys", () => {
  it("keeps stable domain keys for invalidation", () => {
    expect(queryKeys.cart.detail("cart_1")).toEqual(["cart", "detail", "cart_1"]);
    expect(queryKeys.reviews.product("prod_1", "recent")).toEqual([
      "reviews",
      "product",
      "prod_1",
      "recent",
    ]);
    expect(queryKeys.checkout.shippingRates("cart_1", "FR")).toEqual([
      "checkout",
      "shipping-rates",
      "cart_1",
      "FR",
    ]);
  });
});
