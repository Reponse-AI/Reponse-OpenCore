"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { getCartLineTotal } from "@/lib/cart-display";
import { formatPrice } from "@/lib/currency";

interface CartItemCardProps {
  lineId: string;
  initialQuantity: number;
  price: number;
  currency: string;
  productTitle: string;
  productHref: string;
  imageUrl?: string;
  variantTitle?: string | null;
}

export function CartItemCard({
  lineId,
  initialQuantity,
  price,
  currency,
  productTitle,
  productHref,
  imageUrl,
  variantTitle,
}: CartItemCardProps) {
  const { cart, updateItem, removeItem } = useCart();
  const line = cart?.items.find((item) => item.id === lineId);
  if (cart && !line) return null;

  const quantity = line?.quantity ?? initialQuantity;
  const isPending =
    (updateItem.isPending && updateItem.variables?.lineId === lineId) ||
    (removeItem.isPending && removeItem.variables === lineId);
  const error =
    updateItem.variables?.lineId === lineId
      ? updateItem.error
      : removeItem.variables === lineId
        ? removeItem.error
        : null;

  return (
    <div className="flex gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="w-24 h-24 bg-gray-100 rounded-xl relative overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image src={imageUrl} alt={productTitle} fill className="object-cover" />
        ) : (
          <span className="text-xs text-gray-400 absolute inset-0 flex items-center justify-center">
            No img
          </span>
        )}
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="min-w-0">
            <Link
              href={productHref}
              className="block truncate text-sm font-semibold hover:underline"
            >
              {productTitle}
            </Link>
            {variantTitle && (
              <div className="mt-0.5 text-xs text-gray-500">{variantTitle}</div>
            )}
          </div>
          <span className="font-bold">
            {formatPrice(getCartLineTotal(price, quantity), currency)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
            <button
              type="button"
              disabled={isPending || quantity <= 1}
              onClick={() =>
                updateItem.mutate({ lineId, quantity: quantity - 1 })
              }
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
            >
              -
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                updateItem.mutate({ lineId, quantity: quantity + 1 })
              }
              className="w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200 hover:bg-gray-100 disabled:opacity-40"
            >
              +
            </button>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => removeItem.mutate(lineId)}
            className="text-sm text-red-600 hover:text-red-800 font-medium underline disabled:opacity-40"
          >
            Remove
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-600 mt-2" role="alert">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}
