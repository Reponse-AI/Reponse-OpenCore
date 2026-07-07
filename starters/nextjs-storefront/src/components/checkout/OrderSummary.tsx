'use client';

import { useCheckout } from './CheckoutProvider';
import { DiscountInput } from './DiscountInput';
import { GiftCardInput } from './GiftCardInput';
import { LoyaltyRedemption } from './LoyaltyRedemption';
import { formatPrice } from '@/lib/currency';

interface OrderSummaryProps {
  contactId?: string;
}

export function OrderSummary({ contactId }: OrderSummaryProps) {
  const {
    items,
    subtotal,
    shippingCost,
    discountCode,
    discountAmount,
    selectedShippingRate,
    total,
    currency,
    isLoading,
  } = useCheckout();

  if (isLoading && items.length === 0) {
    return (
      <div style={{
        padding: '32px',
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
        Loading your cart…
        <style>{`@keyframes rp-spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  const dividerStyle: React.CSSProperties = {
    border: 'none',
    borderTop: '1px solid var(--rp-color-border)',
    margin: '16px 0',
  };

  return (
    <div style={{
      padding: '24px',
      borderRadius: 'var(--rp-radius)',
      backgroundColor: 'var(--rp-color-surface)',
      border: '1px solid var(--rp-color-border)',
      fontFamily: 'var(--rp-font-family)',
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--rp-color-text)',
        margin: '0 0 20px 0',
      }}>Order Summary</h3>

      {/* Cart Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              flexShrink: 0,
              position: 'relative' as const,
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'var(--rp-color-background)',
                border: '1px solid var(--rp-color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '20px', opacity: 0.3 }}>📦</span>
                )}
              </div>
              {/* Quantity badge */}
              <span style={{
                position: 'absolute' as const,
                top: '-8px',
                right: '-8px',
                minWidth: '22px',
                height: '22px',
                padding: '0 6px',
                borderRadius: '50%',
                backgroundColor: 'var(--rp-color-text)',
                color: 'var(--rp-color-background)',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
                boxSizing: 'border-box' as const,
              }}>{item.quantity}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--rp-color-text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>{item.title}</div>
              {item.variant_title && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--rp-color-text-secondary)',
                  marginTop: '2px',
                }}>{item.variant_title}</div>
              )}
            </div>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--rp-color-text)',
              whiteSpace: 'nowrap',
            }}>{formatPrice(item.line_price, currency)}</div>
          </div>
        ))}
      </div>

      <hr style={dividerStyle} />

      {/* Discount input */}
      <DiscountInput />

      {/* Gift card */}
      <div style={{ marginTop: '12px' }}>
        <GiftCardInput currency={currency} />
      </div>

      {/* Loyalty points redemption */}
      {contactId && (
        <div style={{ marginTop: '12px' }}>
          <LoyaltyRedemption contactId={contactId} currency={currency} />
        </div>
      )}

      <hr style={dividerStyle} />

      {/* Totals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--rp-color-text-secondary)' }}>Subtotal</span>
          <span style={{ color: 'var(--rp-color-text)', fontWeight: 500 }}>{formatPrice(subtotal, currency)}</span>
        </div>

        {discountCode && discountAmount > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
            <span style={{ color: 'var(--rp-color-success)' }}>Discount ({discountCode})</span>
            <span style={{ color: 'var(--rp-color-success)', fontWeight: 500 }}>−{formatPrice(discountAmount, currency)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--rp-color-text-secondary)' }}>Shipping</span>
          <span style={{ color: 'var(--rp-color-text)', fontWeight: 500 }}>
            {selectedShippingRate
              ? (shippingCost === 0 ? 'Free' : formatPrice(shippingCost, currency))
              : '—'}
          </span>
        </div>

        {selectedShippingRate && (
          <div style={{ fontSize: '12px', color: 'var(--rp-color-text-secondary)', textAlign: 'right' as const }}>
            {selectedShippingRate.name}
          </div>
        )}
      </div>

      <hr style={dividerStyle} />

      {/* Total */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--rp-color-text)',
      }}>
        <span>Total</span>
        <span>{formatPrice(total, currency)}</span>
      </div>
    </div>
  );
}
