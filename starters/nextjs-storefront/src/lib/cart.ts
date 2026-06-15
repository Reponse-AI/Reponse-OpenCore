import { cookies } from "next/headers";
import { reponse } from "./reponse";

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

export async function getCart() {
  const cartId = await getCartId();
  if (!cartId) return null;

  try {
    const { data: cart } = await reponse.cart.get({ path: { id: cartId } });
    return cart;
  } catch (err: any) {
    if (err.status === 404) {
      await clearCartId();
    }
    return null;
  }
}

export async function addToCart(productId: string, variantId?: string, quantity: number = 1) {
  let cartId = await getCartId();
  let cart;

  if (!cartId) {
    // Create new cart
    const response = await reponse.cart.create({
      body: {
        items: [{ product_id: productId, variant_id: variantId, quantity }]
      }
    });
    cart = response.data;
    if (cart?.id) {
      await setCartId(cart.id);
    }
    return cart;
  }

  // Add item to existing cart
  try {
    await reponse.cart.addItem({
      path: { id: cartId },
      body: {
        items: [{
          product_id: productId,
          variant_id: variantId,
          quantity,
        }]
      }
    });
    return await getCart();
  } catch (err: any) {
    console.error("Failed to add to cart:", err);
    throw err;
  }
}

export async function updateCartItem(lineId: string, quantity: number) {
  const cartId = await getCartId();
  if (!cartId) return null;

  await reponse.cart.updateItem({
    path: { id: cartId, lineId },
    body: { quantity }
  });

  return getCart();
}

export async function removeCartItem(lineId: string) {
  const cartId = await getCartId();
  if (!cartId) return null;

  await reponse.cart.removeItem({
    path: { id: cartId, lineId }
  });

  return getCart();
}
