import { describe, expect, it } from "vitest";
import { getDistinctVariantTitle } from "./product-title";

describe("getDistinctVariantTitle", () => {
  it("returns a distinct trimmed variant title", () => {
    expect(getDistinctVariantTitle("Tee", "  Blue / Large  ")).toBe("Blue / Large");
  });

  it.each([
    ["Tee", "Tee"],
    ["Tee", "tee"],
    ["Tee", "  Tee  "],
    ["Tee", null],
    ["Tee", ""],
    ["Tee", "   "],
  ])("hides a missing or duplicate variant title", (productTitle, variantTitle) => {
    expect(getDistinctVariantTitle(productTitle, variantTitle)).toBeNull();
  });
});
