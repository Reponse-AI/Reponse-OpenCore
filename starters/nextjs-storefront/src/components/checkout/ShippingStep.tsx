'use client';

import { useState, useEffect, FormEvent, useCallback } from 'react';
import { useCheckout, ShippingRate } from './CheckoutProvider';

const COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
];

export function ShippingStep() {
  const { step, setStep, setShippingAddress, setShippingRate, cartId, apiUrl, apiKey } = useCheckout();

  const [address, setAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    postal_code: '',
    country: 'FR',
  });
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shipping rates when country changes
  const fetchRates = useCallback(async (country: string) => {
    setLoadingRates(true);
    setError(null);
    try {
      const res = await fetch(
        `${apiUrl}/api/v1/shipping/rates?country=${country}&cart_id=${cartId}`,
        { headers: { 'Authorization': `Bearer ${apiKey}` } }
      );
      if (!res.ok) throw new Error('Failed to fetch shipping rates');
      const data = await res.json();
      const ratesData: ShippingRate[] = data.data ?? data.rates ?? data;
      setRates(Array.isArray(ratesData) ? ratesData : []);
      setSelectedRate(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shipping rates');
      setRates([]);
    } finally {
      setLoadingRates(false);
    }
  }, [apiUrl, apiKey, cartId]);

  useEffect(() => {
    if (step === 'shipping') {
      fetchRates(address.country);
    }
  }, [step, address.country, fetchRates]);

  if (step !== 'shipping') return null;

  const handleCountryChange = (country: string) => {
    setAddress(prev => ({ ...prev, country }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!address.address1.trim()) { setError('Please enter your address'); return; }
    if (!address.city.trim()) { setError('Please enter your city'); return; }
    if (!address.postal_code.trim()) { setError('Please enter your postal code'); return; }
    if (!selectedRate) { setError('Please select a shipping method'); return; }
    setShippingAddress(address);
    setShippingRate(selectedRate);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 'var(--rp-radius)',
    border: '1px solid var(--rp-color-border)',
    backgroundColor: 'var(--rp-color-background)',
    color: 'var(--rp-color-text)',
    fontFamily: 'var(--rp-font-family)',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--rp-color-text-secondary)',
    marginBottom: '6px',
    fontFamily: 'var(--rp-font-family)',
  };

  const formatRatePrice = (rate: ShippingRate) => {
    if (rate.is_free || rate.price === 0) return 'Free';
    return new Intl.NumberFormat('en', { style: 'currency', currency: rate.currency || 'EUR' }).format(rate.price);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setStep('contact')}
          aria-label="Back to contact"
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
        }}>Shipping Address</h2>
      </div>

      <div>
        <label htmlFor="shipping-country" style={labelStyle}>Country *</label>
        <select
          id="shipping-country"
          value={address.country}
          onChange={(e) => handleCountryChange(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="shipping-address1" style={labelStyle}>Address *</label>
        <input
          id="shipping-address1"
          type="text"
          value={address.address1}
          onChange={(e) => setAddress(prev => ({ ...prev, address1: e.target.value }))}
          placeholder="123 Main Street"
          required
          autoComplete="address-line1"
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--rp-color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--rp-color-primary) 15%, transparent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--rp-color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      <div>
        <label htmlFor="shipping-address2" style={labelStyle}>Apartment, suite, etc.</label>
        <input
          id="shipping-address2"
          type="text"
          value={address.address2}
          onChange={(e) => setAddress(prev => ({ ...prev, address2: e.target.value }))}
          placeholder="Apt 4B"
          autoComplete="address-line2"
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--rp-color-primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--rp-color-primary) 15%, transparent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--rp-color-border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label htmlFor="shipping-city" style={labelStyle}>City *</label>
          <input
            id="shipping-city"
            type="text"
            value={address.city}
            onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
            placeholder="Paris"
            required
            autoComplete="address-level2"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--rp-color-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--rp-color-primary) 15%, transparent)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--rp-color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
        <div>
          <label htmlFor="shipping-postal" style={labelStyle}>Postal Code *</label>
          <input
            id="shipping-postal"
            type="text"
            value={address.postal_code}
            onChange={(e) => setAddress(prev => ({ ...prev, postal_code: e.target.value }))}
            placeholder="75001"
            required
            autoComplete="postal-code"
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--rp-color-primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--rp-color-primary) 15%, transparent)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--rp-color-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Shipping Rates */}
      <div>
        <h3 style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--rp-color-text)',
          fontFamily: 'var(--rp-font-family)',
          margin: '0 0 12px 0',
        }}>Shipping Method</h3>

        {loadingRates ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--rp-color-text-secondary)',
            fontFamily: 'var(--rp-font-family)',
            fontSize: '14px',
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              border: '2px solid var(--rp-color-border)',
              borderTopColor: 'var(--rp-color-primary)',
              borderRadius: '50%',
              animation: 'rp-spin 0.6s linear infinite',
              margin: '0 auto 8px',
            }} />
            Loading shipping rates…
            <style>{`@keyframes rp-spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : rates.length === 0 ? (
          <p style={{
            padding: '16px',
            textAlign: 'center',
            color: 'var(--rp-color-text-secondary)',
            fontFamily: 'var(--rp-font-family)',
            fontSize: '14px',
            backgroundColor: 'var(--rp-color-surface)',
            borderRadius: 'var(--rp-radius)',
            margin: 0,
          }}>No shipping rates available for this destination</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rates.map(rate => {
              const isSelected = selectedRate?.id === rate.id;
              return (
                <label
                  key={rate.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: 'var(--rp-radius)',
                    border: isSelected
                      ? '2px solid var(--rp-color-primary)'
                      : '1px solid var(--rp-color-border)',
                    backgroundColor: isSelected ? 'var(--rp-color-surface)' : 'var(--rp-color-background)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background-color 0.2s',
                    fontFamily: 'var(--rp-font-family)',
                  }}
                >
                  <input
                    type="radio"
                    name="shipping-rate"
                    value={rate.id}
                    checked={isSelected}
                    onChange={() => setSelectedRate(rate)}
                    style={{ accentColor: 'var(--rp-color-primary)', width: '18px', height: '18px', flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--rp-color-text)' }}>
                      {rate.name}
                    </div>
                    {rate.delivery_estimate && (
                      <div style={{ fontSize: '13px', color: 'var(--rp-color-text-secondary)', marginTop: '2px' }}>
                        {rate.delivery_estimate.min_days}–{rate.delivery_estimate.max_days} business days
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '15px',
                    color: rate.is_free ? 'var(--rp-color-success)' : 'var(--rp-color-text)',
                  }}>
                    {formatRatePrice(rate)}
                  </div>
                </label>
              );
            })}
          </div>
        )}
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
        aria-label="Continue to payment"
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
          cursor: selectedRate ? 'pointer' : 'not-allowed',
          transition: 'background-color 0.2s, transform 0.1s',
          opacity: selectedRate ? 1 : 0.5,
        }}
        disabled={!selectedRate}
        onMouseEnter={(e) => { if (selectedRate) e.currentTarget.style.backgroundColor = 'var(--rp-color-primary-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--rp-color-primary)'; }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Continue to Payment
      </button>
    </form>
  );
}
