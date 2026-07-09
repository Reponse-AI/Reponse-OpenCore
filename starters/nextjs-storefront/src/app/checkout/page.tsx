import { reponse } from "@/lib/reponse";
import { getBuyNowCartId, getCartId } from "@/lib/cart";
import {
  parseCheckoutMode,
  resolveCheckoutCartId,
} from "@/lib/checkout/mode";
import { redirect } from "next/navigation";
import { EmbeddedCheckout } from "./embedded-checkout";
import { env } from "@/env";
import { getStoreConfig } from "@/lib/config";
import { resolveEmbeddedCheckoutConfiguration } from "@/lib/checkout/configuration";
import { CheckoutConfigurationEmptyState } from "@/components/checkout/CheckoutConfigurationEmptyState";

export const metadata = {
  title: "Checkout | Reponse Store",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: rawMode } = await searchParams;
  const mode = parseCheckoutMode(rawMode);
  const [regularCartId, buyNowCartId] = await Promise.all([
    getCartId(),
    getBuyNowCartId(),
  ]);
  const cartId = resolveCheckoutCartId(mode, {
    cartId: regularCartId,
    buyNowCartId,
  });
  const successPath =
    mode === "buy-now" ? "/order/success?mode=buy-now" : "/order/success";

  if (!cartId) {
    redirect(mode === "buy-now" ? "/products" : "/cart");
  }

  // Embedded checkout (default) — Stripe Elements on the storefront
  if (env.CHECKOUT_MODE === "embedded") {
    const storeConfig = await getStoreConfig();
    const checkoutConfiguration = resolveEmbeddedCheckoutConfiguration(
      storeConfig.stripe_publishable_key,
      env.REPONSE_WORKSPACE_ID,
    );

    if (checkoutConfiguration.status === "missing") {
      return (
        <CheckoutConfigurationEmptyState
          paymentsSettingsUrl={checkoutConfiguration.paymentsSettingsUrl}
        />
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
        <EmbeddedCheckout
          cartId={cartId}
          marketId={env.MARKET_ID}
          apiUrl={env.REPONSE_API_URL}
          apiKey={env.REPONSE_API_KEY}
          stripePublishableKey={checkoutConfiguration.stripePublishableKey}
          successPath={successPath}
        />
      </div>
    );
  }

  // Fallback: Stripe Checkout redirect
  let sessionUrl = null;
  let error = null;

  try {
    // market_id is accepted by the API but not yet in the SDK's
    // CreateCheckoutInput type — spread to bypass strict typing until
    // the OpenAPI spec is regenerated.
    const marketId = env.MARKET_ID || undefined;
    const response = await reponse.cart.createCheckout({
      body: {
        cart_id: cartId,
        success_url: `${env.SITE_URL}${successPath}`,
        cancel_url: `${env.SITE_URL}${mode === "buy-now" ? "/products" : "/cart"}`,
        ...(marketId ? { market_id: marketId } : {}),
      } as Parameters<typeof reponse.cart.createCheckout>[0] extends { body?: infer B } ? B : never
    });
    
    if (response.data?.url) {
      sessionUrl = response.data.url;
    } else {
      error = "Checkout session URL not returned from API.";
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout creation failed';
    console.error('Checkout creation failed:', message);
    error = message;
  }

  if (sessionUrl) {
    redirect(sessionUrl);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
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
