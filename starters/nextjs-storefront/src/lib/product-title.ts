export function getDistinctVariantTitle(
  productTitle: string | null | undefined,
  variantTitle: string | null | undefined,
): string | null {
  const normalizedProductTitle = productTitle?.trim().toLocaleLowerCase();
  const trimmedVariantTitle = variantTitle?.trim();

  if (
    !trimmedVariantTitle ||
    trimmedVariantTitle.toLocaleLowerCase() === normalizedProductTitle
  ) {
    return null;
  }

  return trimmedVariantTitle;
}
