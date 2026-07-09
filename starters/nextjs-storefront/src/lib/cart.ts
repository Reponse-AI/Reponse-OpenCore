"use server";

import { cookies } from "next/headers";
import type { Cart } from "@reponseai/sdk";
import { reponse } from "./reponse";
import { getApiErrorMessage, type SdkResult } from "@/lib/api/response";
import type { PromoResult } from "@/types/storefront";
import type { CartSummary } from "@/types/storefront";
import { env } from "@/env";

const CART_COOKIE_NAME = "reponse_cart_id";
const BUY_NOW_CART_COOKIE_NAME = "reponse_buy_now_cart_id";

type CartWithTotals = Cart & {
  discount_total?: number;
  adjusted_total?: number;
};

export async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

export async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: CART_COOKIE_NAME,
    value: cartId,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

export async function getBuyNowCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(BUY_NOW_CART_COOKIE_NAME)?.value;
}

async function setBuyNowCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: BUY_NOW_CART_COOKIE_NAME,
    value: cartId,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearBuyNowCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(BUY_NOW_CART_COOKIE_NAME);
}

export async function getCart() {
  const cartId = await getCartId();
  if (!cartId) return null;

  const { data: cart, error } =
    (await reponse.cart.get({ path: { id: cartId } })) as SdkResult<Cart>;
  if (error) {
    // Note: getCart runs during Server Component rendering, where cookies
    // can't be modified — a stale cart cookie is cleaned up by addToCart's
    // 404 retry path (a Server Action) instead.
    return null;
  }
  return cart ?? null;
}

function toCartSummary(cart: CartWithTotals): CartSummary {
  const items = (cart.items ?? []).map((item) => ({
    id: item.id,
    product_id: item.product_id,
    variant_id: item.variant_id ?? null,
    quantity: item.quantity,
    price: item.price,
  }));

  return {
    id: cart.id,
    item_count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: cart.subtotal,
    discount_total: cart.discount_total,
    adjusted_total: cart.adjusted_total,
    currency: cart.currency,
    items,
  };
}

export async function getCartSummary(): Promise<CartSummary | null> {
  const cart = await getCart();
  return cart ? toCartSummary(cart) : null;
}

export async function addToCart(productId: string, variantId?: string, quantity: number = 1) {
  const cartId = await getCartId();

  if (!cartId) {
    // Create new cart with the item — pass market currency so the cart
    // is not created in the API default (EUR) when the market uses a
    // different base_currency.
    const marketCurrency = env.MARKET_CURRENCY || undefined;
    const { data: cart, error } = (await reponse.cart.create({
      body: {
        items: [{ product_id: productId, variant_id: variantId, quantity }],
        ...(marketCurrency ? { currency: marketCurrency } : {}),
      }
    })) as SdkResult<CartSummary>;
    if (error || !cart?.id) {
      throw new Error(getApiErrorMessage(error, "Failed to create cart"));
    }
    await setCartId(cart.id);
    return cart;
  }

  // Add item to existing cart
  const { data: cart, error, response } = (await reponse.cart.addItem({
    path: { id: cartId },
    body: {
      items: [{
        product_id: productId,
        variant_id: variantId,
        quantity,
      }]
    }
  })) as SdkResult<CartSummary>;
  if (error) {
    // Stale cart ID — drop the cookie and retry once with a fresh cart
    if (response?.status === 404) {
      await clearCartId();
      return addToCart(productId, variantId, quantity);
    }
    throw new Error(getApiErrorMessage(error, "Failed to add to cart"));
  }
  if (!cart) throw new Error("Cart response was empty");
  return cart;
}

export async function createBuyNowCart(productId: string, variantId?: string) {
  const marketCurrency = env.MARKET_CURRENCY || undefined;
  const { data: cart, error } = (await reponse.cart.create({
    body: {
      items: [{ product_id: productId, variant_id: variantId, quantity: 1 }],
      ...(marketCurrency ? { currency: marketCurrency } : {}),
    },
  })) as SdkResult<Cart>;

  if (error || !cart?.id) {
    throw new Error(getApiErrorMessage(error, "Failed to create buy-now cart"));
  }

  await setBuyNowCartId(cart.id);
  return cart;
}

export async function updateCartItem(lineId: string, quantity: number) {
  const cartId = await getCartId();
  if (!cartId) return null;

  const { data: cart, error } = (await reponse.cart.updateItem({
    path: { id: cartId, lineId },
    body: { quantity }
  })) as SdkResult<CartSummary>;
  if (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update cart item"));
  }

  if (!cart) throw new Error("Cart response was empty");
  return cart;
}

export async function removeCartItem(lineId: string) {
  const cartId = await getCartId();
  if (!cartId) return null;

  const { data: cart, error } = (await reponse.cart.removeItem({
    path: { id: cartId, lineId }
  })) as SdkResult<CartSummary>;
  if (error) {
    throw new Error(getApiErrorMessage(error, "Failed to remove cart item"));
  }

  if (!cart) throw new Error("Cart response was empty");
  return cart;
}

// ─── Promo Codes ─────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;

export type { PromoResult } from "@/types/storefront";

export async function applyPromoCode(code: string): Promise<PromoResult> {
  const cartId = await getCartId();
  if (!cartId) return { success: false, error: "No active cart" };

  const res = await fetch(`${apiUrl}/v1/carts/${cartId}/promotions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-workspace-id": workspaceId,
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error || "Invalid promotion code" };
  }

  return {
    success: true,
    code: data.code,
    discount: data.discount,
  };
}

export async function removePromoCode(code: string): Promise<PromoResult> {
  const cartId = await getCartId();
  if (!cartId) return { success: false, error: "No active cart" };

  const res = await fetch(`${apiUrl}/v1/carts/${cartId}/promotions`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-workspace-id": workspaceId,
    },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: data.error || "Failed to remove code" };
  }

  return { success: true, code };
}
