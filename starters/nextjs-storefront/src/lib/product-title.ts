export function getDistinctVariantTitle(
  productTitle: string | null | undefined,
  variantTitle: string | null | undefined,
  hasOnlyOneVariant = false,
): string | null {
  const normalizedProductTitle = productTitle?.trim().toLocaleLowerCase();
  const trimmedVariantTitle = variantTitle?.trim();

  if (
    hasOnlyOneVariant ||
    !trimmedVariantTitle ||
    trimmedVariantTitle.toLocaleLowerCase() === normalizedProductTitle
  ) {
    return null;
  }

  return trimmedVariantTitle;
}
