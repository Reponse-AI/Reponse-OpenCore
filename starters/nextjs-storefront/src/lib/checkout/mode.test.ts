import { describe, expect, it } from "vitest";
import {
  parseCheckoutMode,
  resolveCheckoutCartId,
} from "./mode";

describe("checkout mode", () => {
  it("accepts only the buy-now mode", () => {
    expect(parseCheckoutMode("buy-now")).toBe("buy-now");
    expect(parseCheckoutMode("other")).toBe("cart");
    expect(parseCheckoutMode(undefined)).toBe("cart");
  });

  it("resolves the isolated buy-now cart", () => {
    expect(
      resolveCheckoutCartId("buy-now", {
        cartId: "cart_regular",
        buyNowCartId: "cart_buy_now",
      }),
    ).toBe("cart_buy_now");
  });

  it("resolves the regular cart by default", () => {
    expect(
      resolveCheckoutCartId("cart", {
        cartId: "cart_regular",
        buyNowCartId: "cart_buy_now",
      }),
    ).toBe("cart_regular");
  });
});
