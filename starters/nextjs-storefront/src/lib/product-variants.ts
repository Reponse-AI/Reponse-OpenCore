import type {
  StorefrontOptionDefinition,
  StorefrontProductVariant,
} from "@/types/storefront";

export type SelectedOptions = Record<string, string>;

export function getDefaultSelections(
  optionDefinitions: StorefrontOptionDefinition[],
): SelectedOptions {
  return optionDefinitions.reduce<SelectedOptions>((defaults, option) => {
    const firstValue = option.values[0];
    if (firstValue) defaults[option.name] = firstValue;
    return defaults;
  }, {});
}

export function getSelectedVariant(
  variants: StorefrontProductVariant[],
  optionDefinitions: StorefrontOptionDefinition[],
  selected: SelectedOptions,
): StorefrontProductVariant | undefined {
  if (variants.length === 0) return undefined;
  if (optionDefinitions.length === 0) return variants[0];

  return variants.find((variant) =>
    optionDefinitions.every((option, index) => variant.option_values?.[index] === selected[option.name]),
  );
}

export function isVariantInStock(
  variant: StorefrontProductVariant | undefined,
  productInStock: boolean,
): boolean {
  return (
    productInStock &&
    (variant?.inventory_quantity == null || variant.inventory_quantity > 0)
  );
}

export function isOptionValueAvailable(
  variants: StorefrontProductVariant[],
  optionDefinitions: StorefrontOptionDefinition[],
  selected: SelectedOptions,
  optionName: string,
  value: string,
): boolean {
  if (variants.length === 0) return true;

  const optionIndex = optionDefinitions.findIndex((option) => option.name === optionName);
  if (optionIndex === -1) return false;

  return variants.some((variant) => {
    if (variant.option_values?.[optionIndex] !== value) return false;
    if (variant.inventory_quantity != null && variant.inventory_quantity <= 0) return false;

    return optionDefinitions.every((option, index) => {
      if (option.name === optionName) return true;
      const selectedValue = selected[option.name];
      if (!selectedValue) return true;
      return variant.option_values?.[index] === selectedValue;
    });
  });
}

export function getVariantDisplayState({
  variant,
  fallbackPrice,
  fallbackCompareAtPrice,
  productInStock,
}: {
  variant: StorefrontProductVariant | undefined;
  fallbackPrice: number;
  fallbackCompareAtPrice?: number | null;
  productInStock: boolean;
}) {
  const price = variant?.price ?? fallbackPrice;
  const compareAtPrice = variant?.compare_at_price ?? fallbackCompareAtPrice ?? null;
  const onSale = compareAtPrice != null && compareAtPrice > price;

  return {
    price,
    compareAtPrice,
    onSale,
    inStock: isVariantInStock(variant, productInStock),
  };
}
