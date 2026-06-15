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
      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: '2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem 1.5rem',
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
      }}>
        {/* Left — Checkout Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
        <aside style={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
          <OrderSummary />
        </aside>
      </main>
    </CheckoutProvider>
  );
}
