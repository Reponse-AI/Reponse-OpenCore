import Link from "next/link";
import { getCart, removePromoCode } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PromoCodeForm } from "@/components/PromoCodeForm";
import { getDistinctVariantTitle } from "@/lib/product-title";
import type { StorefrontCart, StorefrontCartItem, StorefrontDiscount } from "@/types/storefront";
import { CartHydrator } from "@/components/CartHydrator";
import { CartItemCard } from "@/components/CartItemCard";
import { CartAmount } from "@/components/CartAmount";
import type { CartSummary } from "@/types/storefront";

export const metadata = {
  title: "Your Cart | Reponse Store",
};

export default async function CartPage() {
  const cart = await getCart();
  const enriched = (cart ?? {}) as Partial<StorefrontCart>;
  const items: StorefrontCartItem[] = enriched.items ?? [];
  const isEmpty = items.length === 0;

  // Discount data from the enriched GET /v1/carts/:id response
  const appliedDiscounts: StorefrontDiscount[] = enriched.applied_discounts ?? [];
  const automaticDiscounts: StorefrontDiscount[] = enriched.automatic_discounts ?? [];
  const discountTotal = enriched.discount_total ?? 0;
  const adjustedTotal = enriched.adjusted_total ?? enriched.subtotal ?? 0;
  const subtotal = enriched.subtotal ?? 0;
  const currency = enriched.currency ?? "EUR";
  const cartSummary: CartSummary | null = enriched.id
    ? {
        id: enriched.id,
        item_count: items.reduce((total, item) => total + item.quantity, 0),
        subtotal,
        discount_total: discountTotal,
        adjusted_total: adjustedTotal,
        currency,
        items: items.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id ?? null,
          quantity: item.quantity,
          price: item.price,
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <CartHydrator cart={cartSummary} />

      <main className="flex-grow max-w-4xl w-full mx-auto px-8 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-10">Your Cart</h1>

        {isEmpty ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products" className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Items List */}
            <div className="flex-grow flex flex-col gap-6">
              {items.map((item) => {
                const productTitle = item.product?.title || `Product #${(item.product_id || "").slice(0, 8)}`;
                const variantTitle = getDistinctVariantTitle(
                  productTitle,
                  item.variant_title,
                  item.has_only_one_variant,
                );

                return (
                  <CartItemCard
                    key={item.id}
                    lineId={item.id}
                    initialQuantity={item.quantity}
                    price={item.price}
                    currency={currency}
                    productTitle={productTitle}
                    productHref={`/products/${item.product?.handle || item.product_id}`}
                    imageUrl={item.product?.images?.[0]}
                    variantTitle={variantTitle}
                  />
                );
              })}
            </div>

            {/* Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    <CartAmount
                      amount="subtotal"
                      fallback={subtotal}
                      currency={currency}
                    />
                  </span>
                </div>

                {/* Applied promo codes */}
                {appliedDiscounts.length > 0 && (
                  <div className="mb-4 flex flex-col gap-2">
                    {appliedDiscounts.map((d) => (
                      <div key={d.code} className="flex items-center justify-between bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 rounded px-1.5 py-0.5 uppercase tracking-wide">
                            {d.code}
                          </span>
                          <span className="text-sm text-emerald-700 font-medium">
                            −{formatPrice(d.savings, currency)}
                          </span>
                        </div>
                        <form action={async () => {
                          "use server";
                          await removePromoCode(d.code);
                          revalidatePath("/cart");
                        }}>
                          <button
                            type="submit"
                            className="w-5 h-5 flex items-center justify-center rounded-full text-emerald-500 hover:bg-emerald-200 hover:text-emerald-700 transition-colors text-xs"
                            title={`Remove ${d.code}`}
                          >
                            ✕
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}

                {/* Automatic discounts (non-removable) */}
                {automaticDiscounts.filter((d) => d.savings > 0).map((d) => (
                  <div key={d.code} className="flex items-center justify-between mb-2 text-gray-500 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="text-xs bg-gray-100 rounded px-1.5 py-0.5 font-medium">{d.code}</span>
                      auto
                    </span>
                    <span className="text-emerald-600 font-medium">−{formatPrice(d.savings, currency)}</span>
                  </div>
                ))}

                {/* Discount total line */}
                {discountTotal > 0 && (
                  <div className="flex justify-between mb-4 text-emerald-600 font-medium">
                    <span>Discount</span>
                    <span>−{formatPrice(discountTotal, currency)}</span>
                  </div>
                )}
                
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                {/* Promo code input */}
                <PromoCodeForm />
                
                <div className="border-t border-gray-100 pt-6 mb-8 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-extrabold text-2xl">
                    <CartAmount
                      amount="total"
                      fallback={adjustedTotal}
                      currency={currency}
                    />
                  </span>
                </div>

                <form action={async () => {
                  "use server";
                  redirect("/checkout");
                }}>
                  <button className="w-full py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-800 transition-colors">
                    Checkout
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
