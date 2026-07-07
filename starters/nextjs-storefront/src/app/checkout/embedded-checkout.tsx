'use client';

import { CheckoutProvider } from '@/components/checkout/CheckoutProvider';
import { ContactStep } from '@/components/checkout/ContactStep';
import { ShippingStep } from '@/components/checkout/ShippingStep';
import { DiscountInput } from '@/components/checkout/DiscountInput';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { PaymentStep } from '@/components/checkout/PaymentStep';

interface EmbeddedCheckoutProps {
  cartId: string;
  marketId: string;
  apiUrl: string;
  apiKey: string;
  stripePublishableKey: string;
}

export function EmbeddedCheckout({ cartId, marketId, apiUrl, apiKey, stripePublishableKey }: EmbeddedCheckoutProps) {
  return (
    <CheckoutProvider cartId={cartId} marketId={marketId} apiUrl={apiUrl} apiKey={apiKey}>
      <main className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 max-w-[1100px] mx-auto px-4 sm:px-6 py-8 w-full min-h-[calc(100vh-64px)]">
        {/* Left — Checkout Steps */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            margin: 0,
            fontFamily: 'var(--rp-font-family, system-ui)',
          }}>
            Checkout
          </h1>
          <ContactStep />
          <ShippingStep />
          <DiscountInput />
          <PaymentStep stripePublicKey={stripePublishableKey} />
        </div>

        {/* Right — Order Summary */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <OrderSummary />
        </aside>
      </main>
    </CheckoutProvider>
  );
}
