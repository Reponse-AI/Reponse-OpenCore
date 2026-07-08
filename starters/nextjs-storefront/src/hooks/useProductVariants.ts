"use client";

import { useMemo, useState } from "react";
import {
  getDefaultSelections,
  getSelectedVariant,
  getVariantDisplayState,
  isOptionValueAvailable,
  type SelectedOptions,
} from "@/lib/product-variants";
import type {
  StorefrontOptionDefinition,
  StorefrontProductVariant,
} from "@/types/storefront";

export function useProductVariants({
  variants,
  optionDefinitions,
  inStock,
  initialPrice,
  initialCompareAtPrice,
}: {
  variants: StorefrontProductVariant[];
  optionDefinitions: StorefrontOptionDefinition[];
  inStock: boolean;
  initialPrice: number;
  initialCompareAtPrice?: number | null;
}) {
  const defaultSelections = useMemo(
    () => getDefaultSelections(optionDefinitions),
    [optionDefinitions],
  );
  const [selected, setSelected] = useState<SelectedOptions>(defaultSelections);

  const matchedVariant = useMemo(
    () => getSelectedVariant(variants, optionDefinitions, selected),
    [optionDefinitions, selected, variants],
  );
  const displayVariant = matchedVariant ?? variants[0];
  const displayState = useMemo(
    () =>
      getVariantDisplayState({
        variant: displayVariant,
        fallbackPrice: initialPrice,
        fallbackCompareAtPrice: initialCompareAtPrice,
        productInStock: inStock,
      }),
    [displayVariant, inStock, initialCompareAtPrice, initialPrice],
  );

  return {
    selected,
    setSelected,
    displayVariant,
    displayPrice: displayState.price,
    displayCompareAt: displayState.compareAtPrice,
    isOnSale: displayState.onSale,
    variantInStock: displayState.inStock,
    isValueAvailable: (optionName: string, value: string) =>
      isOptionValueAvailable(variants, optionDefinitions, selected, optionName, value),
    selectOption: (optionName: string, value: string) => {
      setSelected((current) => ({ ...current, [optionName]: value }));
    },
  };
}
