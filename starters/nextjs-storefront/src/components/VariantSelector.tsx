"use client";

import { Check, LoaderCircle, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useCartMutations } from "@/hooks/useCartMutations";
import { useProductVariants } from "@/hooks/useProductVariants";
import type {
  StorefrontOptionDefinition,
  StorefrontProductVariant,
} from "@/types/storefront";

interface VariantSelectorProps {
  productId: string;
  variants: StorefrontProductVariant[];
  optionDefinitions: StorefrontOptionDefinition[];
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
  const {
    selected,
    displayVariant,
    displayPrice,
    displayCompareAt,
    isOnSale,
    variantInStock,
    isValueAvailable,
    selectOption,
  } = useProductVariants({
    variants,
    optionDefinitions,
    inStock,
    initialPrice,
    initialCompareAtPrice,
  });
  const { addItem } = useCartMutations();
  const adding = addItem.isPending;
  const added = addItem.isSuccess;
  const error = addItem.error instanceof Error ? addItem.error.message : null;

  const handleAddToCart = () => {
    if (!variantInStock || adding) return;
    addItem.mutate({ productId, variantId: displayVariant?.id, quantity: 1 });
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
                      onClick={() => isAvailable && selectOption(option.name, value)}
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
              <LoaderCircle className="size-5 animate-spin" aria-hidden="true" />
              Adding…
            </>
          ) : added ? (
            <>
              <Check className="size-5" aria-hidden="true" />
              Added to Cart
            </>
          ) : variantInStock ? (
            <>
              <ShoppingCart className="size-5" aria-hidden="true" />
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
