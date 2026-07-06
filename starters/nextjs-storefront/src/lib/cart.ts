"use server";

import { cookies } from "next/headers";
import type { Cart } from "@reponseai/sdk";
import { reponse } from "./reponse";

// The SDK methods type their result as a union over an unresolved ThrowOnError
// generic; at runtime throwOnError is false, so the result always has this shape.
type SdkResult<T> = { data?: T; error?: unknown; response?: Response };

const CART_COOKIE_NAME = "reponse_cart_id";

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
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearCartId() {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

// The SDK never throws — it returns { data, error, response }.
// API errors come back as { error: "message" }.
function apiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "error" in error) {
    return String((error as { error: unknown }).error);
  }
  return fallback;
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

export async function addToCart(productId: string, variantId?: string, quantity: number = 1) {
  const cartId = await getCartId();

  if (!cartId) {
    // Create new cart with the item
    const { data: cart, error } = (await reponse.cart.create({
      body: {
        items: [{ product_id: productId, variant_id: variantId, quantity }]
      }
    })) as SdkResult<Cart>;
    if (error || !cart?.id) {
      throw new Error(apiErrorMessage(error, "Failed to create cart"));
    }
    await setCartId(cart.id);
    return cart;
  }

  // Add item to existing cart
  const { error, response } = (await reponse.cart.addItem({
    path: { id: cartId },
    body: {
      items: [{
        product_id: productId,
        variant_id: variantId,
        quantity,
      }]
    }
  })) as SdkResult<unknown>;
  if (error) {
    // Stale cart ID — drop the cookie and retry once with a fresh cart
    if (response?.status === 404) {
      await clearCartId();
      return addToCart(productId, variantId, quantity);
    }
    throw new Error(apiErrorMessage(error, "Failed to add to cart"));
  }
  return getCart();
}

export async function updateCartItem(lineId: string, quantity: number) {
  const cartId = await getCartId();
  if (!cartId) return null;

  const { error } = (await reponse.cart.updateItem({
    path: { id: cartId, lineId },
    body: { quantity }
  })) as SdkResult<unknown>;
  if (error) {
    throw new Error(apiErrorMessage(error, "Failed to update cart item"));
  }

  return getCart();
}

export async function removeCartItem(lineId: string) {
  const cartId = await getCartId();
  if (!cartId) return null;

  const { error } = (await reponse.cart.removeItem({
    path: { id: cartId, lineId }
  })) as SdkResult<unknown>;
  if (error) {
    throw new Error(apiErrorMessage(error, "Failed to remove cart item"));
  }

  return getCart();
}

// ─── Promo Codes ─────────────────────────────────────────────
// Direct fetch because the SDK hasn't been regenerated yet for these routes.

const apiUrl = process.env.REPONSE_API_URL || "https://reponse.ai/api";
const workspaceId = process.env.REPONSE_WORKSPACE_ID || "";

export type PromoResult = {
  success: boolean;
  error?: string;
  code?: string;
  discount?: number;
};

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

