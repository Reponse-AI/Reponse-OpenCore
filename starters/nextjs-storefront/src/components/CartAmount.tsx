"use client";

import { useCart } from "@/components/CartProvider";
import { getCartDisplayTotals } from "@/lib/cart-display";
import { formatPrice } from "@/lib/currency";

interface CartAmountProps {
  amount: "subtotal" | "total";
  fallback: number;
  currency: string;
}

export function CartAmount({
  amount,
  fallback,
  currency,
}: CartAmountProps) {
  const { cart } = useCart();
  const value = cart ? getCartDisplayTotals(cart)[amount] : fallback;

  return <>{formatPrice(value, cart?.currency ?? currency)}</>;
}
