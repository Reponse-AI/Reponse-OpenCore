import { describe, expect, it } from "vitest";
import { getDefaultSelections, getSelectedVariant, isOptionValueAvailable } from "./product-variants";
import type { StorefrontOptionDefinition, StorefrontProductVariant } from "@/types/storefront";

const options: StorefrontOptionDefinition[] = [
  { name: "Size", position: 1, values: ["S", "M"] },
  { name: "Color", position: 2, values: ["Black", "White"] },
];

const variants: StorefrontProductVariant[] = [
  { id: "v1", price: 10, inventory_quantity: 2, option_values: ["S", "Black"] },
  { id: "v2", price: 12, inventory_quantity: 0, option_values: ["M", "Black"] },
  { id: "v3", price: 12, inventory_quantity: 3, option_values: ["M", "White"] },
];

describe("product variant helpers", () => {
  it("builds default selections from the first value of each option", () => {
    expect(getDefaultSelections(options)).toEqual({ Size: "S", Color: "Black" });
  });

  it("finds the variant matching all selected options", () => {
    expect(getSelectedVariant(variants, options, { Size: "M", Color: "White" })?.id).toBe("v3");
  });

  it("marks option values unavailable when no in-stock variant matches current selections", () => {
    expect(isOptionValueAvailable(variants, options, { Size: "S", Color: "Black" }, "Size", "M")).toBe(
      false,
    );
    expect(isOptionValueAvailable(variants, options, { Size: "M", Color: "Black" }, "Color", "White")).toBe(
      true,
    );
  });
});
