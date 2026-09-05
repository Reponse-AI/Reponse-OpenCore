"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useCartDrawer } from "@/components/CartDrawerProvider";
import { getCartDisplayTotals, getCartLineTotal } from "@/lib/cart-display";
import { formatPrice } from "@/lib/currency";
import type { CartSummaryItem } from "@/types/storefront";

function CartDrawerLine({
  line,
  currency,
  onNavigate,
}: {
  line: CartSummaryItem;
  currency: string;
  onNavigate: () => void;
}) {
  const { updateItem, removeItem } = useCart();

  const isPending =
    (updateItem.isPending && updateItem.variables?.lineId === line.id) ||
    (removeItem.isPending && removeItem.variables === line.id);

  const title = line.title || "Item";
  const href = `/products/${line.handle || line.product_id}`;

  return (
    <li className="flex gap-4 py-4">
      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
        {line.image_url ? (
          <Image
            src={line.image_url}
            alt={title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-gray-300">
            <ShoppingBag className="size-6" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={href}
              onClick={onNavigate}
              className="block truncate text-sm font-semibold hover:underline"
            >
              {title}
            </Link>
            {line.variant_title && (
              <p className="mt-0.5 truncate text-xs text-gray-500">
                {line.variant_title}
              </p>
            )}
          </div>
          <span className="shrink-0 text-sm font-bold tabular-nums">
            {formatPrice(getCartLineTotal(line.price, line.quantity), currency)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              type="button"
              disabled={isPending || line.quantity <= 1}
              onClick={() =>
                updateItem.mutate({
                  lineId: line.id,
                  quantity: line.quantity - 1,
                })
              }
              aria-label={`Decrease quantity of ${title}`}
              className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span
              className="w-6 text-center text-sm font-medium tabular-nums"
              aria-label={`Quantity: ${line.quantity}`}
            >
              {line.quantity}
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                updateItem.mutate({
                  lineId: line.id,
                  quantity: line.quantity + 1,
                })
              }
              aria-label={`Increase quantity of ${title}`}
              className="flex size-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => removeItem.mutate(line.id)}
            className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { isOpen, closeCart } = useCartDrawer();
  const { cart, itemCount } = useCart();

  // ESC closes the drawer.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const items = cart?.items ?? [];
  const currency = cart?.currency ?? "EUR";
  const totals = cart ? getCartDisplayTotals(cart) : null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity duration-300 motion-reduce:transition-none ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel: full-width on mobile, a right-hand rail from sm up */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-[91] flex w-full max-w-md flex-col bg-white text-gray-900 shadow-2xl font-[family-name:var(--font-geist-sans)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold tracking-tight">
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-10 text-gray-300" aria-hidden="true" />
            <p className="text-base font-semibold">Your cart is empty</p>
            <p className="text-sm text-gray-500">
              Looks like you haven&apos;t added anything yet.
            </p>
            <Link
              href="/products"
              onClick={closeCart}
              className="mt-2 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-gray-100 overflow-y-auto px-5">
              {items.map((line) => (
                <CartDrawerLine
                  key={line.id}
                  line={line}
                  currency={currency}
                  onNavigate={closeCart}
                />
              ))}
            </ul>

            {/*
              The chat widget floats over the bottom of the viewport at the top
              of the stacking order, so the footer reserves room below its CTAs
              (plus the iOS home-indicator inset) to keep them tappable.
            */}
            <footer className="border-t border-gray-100 px-5 pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  {formatPrice(totals?.subtotal ?? 0, currency)}
                </span>
              </div>

              {totals && totals.discountTotal > 0 && (
                <div className="mt-2 flex items-center justify-between text-sm font-medium text-emerald-600">
                  <span>Discount</span>
                  <span className="tabular-nums">
                    -{formatPrice(totals.discountTotal, currency)}
                  </span>
                </div>
              )}

              <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-extrabold tabular-nums">
                  {formatPrice(totals?.total ?? 0, currency)}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Shipping calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-black py-4 text-base font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-3 block text-center text-sm font-medium text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-900"
              >
                View cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
