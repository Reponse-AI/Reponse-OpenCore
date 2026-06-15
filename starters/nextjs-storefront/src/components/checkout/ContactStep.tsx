'use client';

import { useState, FormEvent } from 'react';
import { useCheckout } from './CheckoutProvider';

export function ContactStep() {
  const { setContact, customerEmail, customerName, step } = useCheckout();
  const [email, setEmail] = useState(customerEmail);
  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (step !== 'contact') return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setContact(email, name);
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--rp-color-text)',
          fontFamily: 'var(--rp-font-family)',
          margin: '0 0 4px 0',
        }}>Contact Information</h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--rp-color-text-secondary)',
          fontFamily: 'var(--rp-font-family)',
          margin: 0,
        }}>We&apos;ll use this to send your order confirmation</p>
      </div>

      <div>
        <label htmlFor="checkout-email" style={labelStyle}>Email *</label>
        <input
          id="checkout-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          aria-required="true"
          autoComplete="email"
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
        <label htmlFor="checkout-name" style={labelStyle}>Full Name *</label>
        <input
          id="checkout-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          aria-required="true"
          autoComplete="name"
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
        <label htmlFor="checkout-phone" style={labelStyle}>Phone (optional)</label>
        <input
          id="checkout-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+33 6 12 34 56 78"
          autoComplete="tel"
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
        aria-label="Continue to shipping"
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
          cursor: 'pointer',
          transition: 'background-color 0.2s, transform 0.1s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--rp-color-primary-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--rp-color-primary)'; }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        Continue to Shipping
      </button>
    </form>
  );
}
