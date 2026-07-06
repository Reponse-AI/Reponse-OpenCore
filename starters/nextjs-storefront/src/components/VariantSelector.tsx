"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
// ─── Types ───────────────────────────────────────────────────────────────────

interface OptionDefinition {
  name: string;
  position: number;
  values: string[];
}

interface Variant {
  id: string;
  price?: number;
  compare_at_price?: number;
  inventory_quantity?: number;
  option_values?: string[];
  sku?: string;
}

interface VariantSelectorProps {
  productId: string;
  variants: Variant[];
  optionDefinitions: OptionDefinition[];
  currency: string;
  inStock: boolean;
  /** Initial price (from the server-rendered product) */
  initialPrice: number;
  initialCompareAtPrice?: number | null;
}



// ─── Component ───────────────────────────────────────────────────────────────

export function VariantSelector({
  productId,
  variants,
  optionDefinitions,
  currency,
  inStock,
  initialPrice,
  initialCompareAtPrice,
}: VariantSelectorProps) {
  const router = useRouter();

  // Build initial selected option map: { [optionName]: firstValue }
  const buildDefaultSelections = () => {
    const defaults: Record<string, string> = {};
    optionDefinitions.forEach((opt) => {
      if (opt.values.length > 0) defaults[opt.name] = opt.values[0];
    });
    return defaults;
  };

  const [selected, setSelected] = useState<Record<string, string>>(
    buildDefaultSelections()
  );
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve which variant matches the current selections
  const matchedVariant = useCallback((): Variant | undefined => {
    if (variants.length === 0) return undefined;
    if (optionDefinitions.length === 0) return variants[0];

    return variants.find((v) =>
      optionDefinitions.every((opt, idx) => {
        const selectedVal = selected[opt.name];
        return v.option_values?.[idx] === selectedVal;
      })
    );
  }, [selected, variants, optionDefinitions])();

  const displayVariant = matchedVariant ?? variants[0];
  const displayPrice = displayVariant?.price ?? initialPrice;
  const displayCompareAt =
    displayVariant?.compare_at_price ?? initialCompareAtPrice ?? null;
  const isOnSale = displayCompareAt != null && displayCompareAt > displayPrice;
  const variantInStock =
    inStock &&
    (displayVariant?.inventory_quantity == null ||
      displayVariant.inventory_quantity > 0);

  // Check if a particular option value is available (has stock)
  const isValueAvailable = (optionName: string, value: string) => {
    if (variants.length === 0) return true;
    return variants.some((v) => {
      const optIdx = optionDefinitions.findIndex((o) => o.name === optionName);
      if (optIdx === -1) return false;
      if (v.option_values?.[optIdx] !== value) return false;
      // All other currently selected options must also match
      return optionDefinitions.every((opt, idx) => {
        if (opt.name === optionName) return true;
        const sel = selected[opt.name];
        if (!sel) return true;
        return v.option_values?.[idx] === sel;
      });
    });
  };

  const handleSelect = (optionName: string, value: string) => {
    setSelected((prev) => ({ ...prev, [optionName]: value }));
    setAdded(false);
    setError(null);
  };

  const handleAddToCart = async () => {
    if (!variantInStock || adding) return;
    setAdding(true);
    setError(null);

    try {
      // Server Action — the cart ID lives in an httpOnly cookie, the single
      // source of truth shared with the cart page and the header count.
      await addToCart(productId, displayVariant?.id, 1);
      setAdded(true);
      // Refresh server state (cart count in header)
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dynamic Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold">
          {formatPrice(displayPrice, currency)}
        </span>
        {isOnSale && displayCompareAt && (
          <>
            <span className="text-xl text-gray-400 line-through">
              {formatPrice(displayCompareAt, currency)}
            </span>
            <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              -{Math.round((1 - displayPrice / displayCompareAt) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* Variant Options */}
      {optionDefinitions.length > 0 && (
        <div className="space-y-4">
          {optionDefinitions.map((option) => (
            <div key={option.name}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {option.name}
                {selected[option.name] && (
                  <span className="ml-2 font-normal text-gray-500">
                    — {selected[option.name]}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isAvailable = isValueAvailable(option.name, value);
                  const isActive = selected[option.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && handleSelect(option.name, value)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                        isActive
                          ? "border-black bg-black text-white shadow-sm"
                          : isAvailable
                          ? "border-gray-300 bg-white hover:border-black cursor-pointer"
                          : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through"
                      }`}
                      aria-pressed={isActive}
                      aria-label={`Select ${option.name}: ${value}${!isAvailable ? " (unavailable)" : ""}`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stock indicator */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full inline-block ${
            variantInStock ? "bg-green-500" : "bg-gray-300"
          }`}
        />
        <span className={`text-sm font-medium ${variantInStock ? "text-green-700" : "text-gray-400"}`}>
          {variantInStock
            ? displayVariant?.inventory_quantity != null &&
              displayVariant.inventory_quantity <= 5
              ? `Only ${displayVariant.inventory_quantity} left`
              : "In stock"
            : "Out of stock"}
        </span>
      </div>

      {/* Add to Cart CTA */}
      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          disabled={!variantInStock || adding}
          className="w-full py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          aria-live="polite"
        >
          {adding ? (
            <>
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Adding…
            </>
          ) : added ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Added to Cart
            </>
          ) : variantInStock ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </button>

        {error && (
          <p className="text-sm text-red-600 mt-3 text-center" role="alert">
            {error}
          </p>
        )}

        {!variantInStock && !error && (
          <p className="text-center text-sm text-gray-400 mt-3">
            This item is currently out of stock. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
