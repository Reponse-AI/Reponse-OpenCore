'use client';

import { formatPrice } from '@/lib/currency';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FormEvent, useEffect, useState } from 'react';
import { useCheckout } from './CheckoutProvider';
import { useConfirmOrder } from '@/hooks/useCheckoutApi';
import { resolveEmbeddedCheckoutConfiguration } from '@/lib/checkout/configuration';
import { CheckoutConfigurationEmptyState } from './CheckoutConfigurationEmptyState';

// ─── Inner Payment Form ──────────────────────────────────────────────────────

function PaymentForm({ successPath }: { successPath: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const { setStep, customerEmail, customerName, shippingAddress, marketId, cartId, apiUrl, apiKey, total, currency } = useCheckout();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const confirmOrder = useConfirmOrder();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: customerEmail,
          return_url: `${window.location.origin}${successPath}`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await confirmOrder.mutateAsync({
          apiUrl,
          apiKey,
          cartId,
          paymentIntentId: paymentIntent.id,
          customerEmail,
          customerName,
          shippingAddress,
          marketId,
        });

        const separator = successPath.includes('?') ? '&' : '?';
        window.location.href = `${window.location.origin}${successPath}${separator}payment_intent=${paymentIntent.id}`;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const formattedTotal = formatPrice(total, currency);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setStep('shipping')}
          aria-label="Back to shipping"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--rp-color-text-secondary)',
            fontSize: '20px',
            lineHeight: 1,
            fontFamily: 'var(--rp-font-family)',
          }}
        >←</button>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--rp-color-text)',
          fontFamily: 'var(--rp-font-family)',
          margin: 0,
        }}>Payment</h2>
      </div>

      <div style={{
        padding: '16px',
        borderRadius: 'var(--rp-radius)',
        border: '1px solid var(--rp-color-border)',
        backgroundColor: 'var(--rp-color-background)',
      }}>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <p role="alert" style={{
          margin: 0,
          padding: '10px 14px',
          borderRadius: 'var(--rp-radius)',
          backgroundColor: 'color-mix(in srgb, var(--rp-color-error) 8%, transparent)',
          color: 'var(--rp-color-error)',
          fontSize: '13px',
          fontFamily: 'var(--rp-font-family)',
        }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        aria-label="Pay now"
        style={{
          width: '100%',
          padding: '16px',
          borderRadius: 'var(--rp-radius)',
          border: 'none',
          backgroundColor: 'var(--rp-color-primary)',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: 600,
          fontFamily: 'var(--rp-font-family)',
          cursor: isProcessing ? 'wait' : 'pointer',
          transition: 'background-color 0.2s, transform 0.1s',
          opacity: isProcessing ? 0.7 : 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.backgroundColor = 'var(--rp-color-primary-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--rp-color-primary)'; }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {isProcessing ? (
          <>
            <span style={{
              width: '18px',
              height: '18px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'rp-spin 0.6s linear infinite',
              display: 'inline-block',
            }} />
            Processing…
            <style>{`@keyframes rp-spin { to { transform: rotate(360deg) } }`}</style>
          </>
        ) : (
          <>Pay {formattedTotal}</>
        )}
      </button>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '12px',
        color: 'var(--rp-color-text-secondary)',
        fontFamily: 'var(--rp-font-family)',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Secured by Stripe
      </div>
    </form>
  );
}

// ─── Payment Step Wrapper ──────────────────────────────────────────────────────

interface PaymentStepProps {
  stripePublicKey: string;
  workspaceId: string;
  successPath: string;
}

export function PaymentStep({ stripePublicKey, workspaceId, successPath }: PaymentStepProps) {
  const { step, setStep, createPaymentIntent } = useCheckout();
  const checkoutConfiguration = resolveEmbeddedCheckoutConfiguration(
    stripePublicKey,
    workspaceId,
    step,
  );
  const [stripePromise] = useState(() => {
    const normalizedKey = stripePublicKey.trim();
    return normalizedKey ? loadStripe(normalizedKey) : null;
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (checkoutConfiguration.status !== 'ready') return;
    let cancelled = false;

    async function init() {
      setIsLoading(true);
      setError(null);
      try {
        const secret = await createPaymentIntent();
        if (!cancelled) setClientSecret(secret);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, [checkoutConfiguration.status, createPaymentIntent]);

  if (checkoutConfiguration.status === 'hidden') return null;

  if (checkoutConfiguration.status === 'missing') {
    return (
      <CheckoutConfigurationEmptyState
        paymentsSettingsUrl={checkoutConfiguration.paymentsSettingsUrl}
        onBack={() => setStep('shipping')}
      />
    );
  }

  if (isLoading || !clientSecret) {
    return (
      <div style={{
        padding: '48px 24px',
        textAlign: 'center',
        fontFamily: 'var(--rp-font-family)',
        color: 'var(--rp-color-text-secondary)',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '2px solid var(--rp-color-border)',
          borderTopColor: 'var(--rp-color-primary)',
          borderRadius: '50%',
          animation: 'rp-spin 0.6s linear infinite',
          margin: '0 auto 12px',
        }} />
        Preparing payment…
        <style>{`@keyframes rp-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'var(--rp-font-family)',
      }}>
        <p role="alert" style={{
          padding: '12px 16px',
          borderRadius: 'var(--rp-radius)',
          backgroundColor: 'color-mix(in srgb, var(--rp-color-error) 8%, transparent)',
          color: 'var(--rp-color-error)',
          fontSize: '14px',
          margin: '0 0 16px 0',
        }}>{error}</p>
        <button
          onClick={() => {
            setError(null);
            setClientSecret(null);
          }}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--rp-radius)',
            border: '1px solid var(--rp-color-border)',
            backgroundColor: 'var(--rp-color-surface)',
            color: 'var(--rp-color-text)',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--rp-font-family)',
            cursor: 'pointer',
          }}
        >Try Again</button>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: 'var(--rp-color-primary)',
            borderRadius: 'var(--rp-radius)',
            fontFamily: 'var(--rp-font-family)',
          },
        },
      }}
    >
          <PaymentForm successPath={successPath} />
    </Elements>
  );
}
