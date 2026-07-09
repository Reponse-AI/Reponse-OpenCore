interface CartAmounts {
  subtotal: number;
  discount_total?: number;
  adjusted_total?: number;
}

export function getCartLineTotal(unitPrice: number, quantity: number) {
  return unitPrice * quantity;
}

export function getCartDisplayTotals(cart: CartAmounts) {
  const discountTotal = cart.discount_total ?? 0;

  return {
    subtotal: cart.subtotal,
    discountTotal,
    total: cart.adjusted_total ?? cart.subtotal - discountTotal,
  };
}
