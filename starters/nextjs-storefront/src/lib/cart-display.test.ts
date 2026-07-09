import { describe, expect, it } from "vitest";
import { getCartDisplayTotals, getCartLineTotal } from "./cart-display";

describe("cart display amounts", () => {
  it("multiplies the unit price by the current quantity", () => {
    expect(getCartLineTotal(69.99, 3)).toBeCloseTo(209.97);
  });

  it("uses server-adjusted totals when discounts are present", () => {
    expect(
      getCartDisplayTotals({
        subtotal: 209.97,
        discount_total: 20,
        adjusted_total: 189.97,
      }),
    ).toEqual({
      subtotal: 209.97,
      discountTotal: 20,
      total: 189.97,
    });
  });
});
