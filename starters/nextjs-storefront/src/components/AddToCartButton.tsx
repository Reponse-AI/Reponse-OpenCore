"use client";

import { Check, LoaderCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useCartDrawer } from "@/components/CartDrawerProvider";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string;
  price: number;
  currency: string;
  disabled?: boolean;
  compact?: boolean;
  /**
   * Display metadata, forwarded to the cart cache so the drawer can show the
   * new line complete before the enriched cart is refetched.
   */
  productTitle?: string;
  productHandle?: string;
  productImage?: string;
  variantTitle?: string | null;
}

export function AddToCartButton({
  productId,
  variantId,
  price,
  currency,
  disabled = false,
  compact = false,
  productTitle,
  productHandle,
  productImage,
  variantTitle,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { openCart } = useCartDrawer();
  const isThisProductPending =
    addItem.isPending && addItem.variables?.productId === productId;
  const isThisProductAdded =
    addItem.isSuccess && addItem.variables?.productId === productId;

  return (
    <>
      <button
      type="button"
      disabled={disabled || isThisProductPending}
      onClick={() =>
        addItem.mutate(
          {
            productId,
            variantId,
            quantity: 1,
            price,
            currency,
            title: productTitle,
            handle: productHandle,
            imageUrl: productImage,
            variantTitle,
          },
          // Per-call callback: the drawer opens only for a real click, never on
          // mount or on cart hydration.
          { onSuccess: () => openCart() },
        )
      }
      className={
        compact
          ? "px-3 py-2 bg-black text-white text-xs font-semibold rounded-xl hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-1.5"
          : "w-full py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      }
      aria-live="polite"
    >
      {isThisProductPending ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {compact ? "Adding" : "Adding…"}
        </>
      ) : isThisProductAdded ? (
        <>
          <Check className="size-4" aria-hidden="true" />
          {compact ? "Added" : "Added to Cart"}
        </>
      ) : disabled ? (
        "Sold Out"
      ) : (
        <>
          <ShoppingCart className="size-4" aria-hidden="true" />
          {compact ? "Add" : "Add to Cart"}
        </>
      )}
      </button>
      {addItem.error && addItem.variables?.productId === productId && (
        <span className="text-xs text-red-600" role="alert">
          {addItem.error.message}
        </span>
      )}
    </>
  );
}
