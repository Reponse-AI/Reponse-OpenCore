import { Header } from "@/components/Header";
import { reponse } from "@/lib/reponse";
import { getCartId } from "@/lib/cart";
import { redirect } from "next/navigation";
import { EmbeddedCheckout } from "./embedded-checkout";

export const metadata = {
  title: "Checkout | Reponse Storefront",
};

const CHECKOUT_MODE = process.env.CHECKOUT_MODE || "embedded";

export default async function CheckoutPage() {
  const cartId = await getCartId();

  if (!cartId) {
    redirect("/cart");
  }

  // Embedded checkout (default) — Stripe Elements on the storefront
  if (CHECKOUT_MODE === "embedded") {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
        <Header />
        <EmbeddedCheckout
          cartId={cartId}
          marketId={process.env.NEXT_PUBLIC_MARKET_ID || ""}
          apiUrl={process.env.NEXT_PUBLIC_REPONSE_API_URL || ""}
          apiKey={process.env.NEXT_PUBLIC_REPONSE_API_KEY || ""}
          stripePublishableKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""}
        />
      </div>
    );
  }

  // Fallback: Stripe Checkout redirect
  let sessionUrl = null;
  let error = null;

  try {
    const response = await reponse.cart.createCheckout({
      body: {
        cart_id: cartId,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/order/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/cart`,
      }
    });
    
    if (response.data?.url) {
      sessionUrl = response.data.url;
    } else {
      error = "Checkout session URL not returned from API.";
    }
  } catch (err: any) {
    console.error("Checkout creation failed:", err.message);
    error = err.message;
  }

  if (sessionUrl) {
    redirect(sessionUrl);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />
      <main className="flex-grow max-w-2xl w-full mx-auto px-8 py-32 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Checkout Error</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          We couldn&apos;t initialize the checkout process. Please make sure Stripe is correctly configured in your Reponse workspace.
        </p>
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm mb-8 w-full text-left">
            <code>{error}</code>
          </div>
        )}
        <a href="/cart" className="inline-block px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Return to Cart
        </a>
      </main>
    </div>
  );
}
