'use client';

import { useState, FormEvent } from 'react';
import { formatPrice } from '@/lib/currency';

interface GiftCardInputProps {
  currency: string;
}

interface AppliedGiftCard {
  code: string;
  amount: number;
}

export function GiftCardInput({ currency }: GiftCardInputProps) {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCard, setAppliedCard] = useState<AppliedGiftCard | null>(null);

  const env = typeof window !== 'undefined'
    ? ((globalThis as unknown as { __ENV?: { REPONSE_API_URL?: string; REPONSE_WORKSPACE_ID?: string } }).__ENV ?? {})
    : {};
  const apiUrl = env.REPONSE_API_URL || 'https://reponse.ai/api';
  const workspaceId = env.REPONSE_WORKSPACE_ID || '';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsApplying(true);
    setError(null);

    try {
      const res = await fetch(`${apiUrl}/v1/gift-cards/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-workspace-id': workspaceId,
        },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid gift card code');
        return;
      }

      setAppliedCard({
        code: code.trim().toUpperCase(),
        amount: data.amount ?? data.balance ?? 0,
      });
      setCode('');
    } catch {
      setError('Failed to redeem gift card');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    setAppliedCard(null);
    setError(null);
  };

  // If a gift card is applied, show it
  if (appliedCard) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 'var(--rp-radius)',
        backgroundColor: 'color-mix(in srgb, var(--rp-color-success) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--rp-color-success) 25%, transparent)',
        fontFamily: 'var(--rp-font-family)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🎁</span>
          <div>
            <div style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--rp-color-text)',
            }}>
              Gift Card {appliedCard.code}
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--rp-color-success)',
              fontWeight: 500,
            }}>
              −{formatPrice(appliedCard.amount, currency)} applied
            </div>
          </div>
        </div>
        <button
          onClick={handleRemove}
          aria-label="Remove gift card"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--rp-color-text-secondary)',
            fontSize: '18px',
            padding: '4px',
            lineHeight: 1,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--rp-color-error)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--rp-color-text-secondary)'; }}
        >×</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(null); }}
          placeholder="Gift card code"
          aria-label="Gift card code"
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 'var(--rp-radius)',
            border: error ? '1px solid var(--rp-color-error)' : '1px solid var(--rp-color-border)',
            backgroundColor: 'var(--rp-color-background)',
            color: 'var(--rp-color-text)',
            fontFamily: 'var(--rp-font-family)',
            fontSize: '14px',
            outline: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box' as const,
          }}
          onFocus={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--rp-color-primary)';
          }}
          onBlur={(e) => {
            if (!error) e.currentTarget.style.borderColor = 'var(--rp-color-border)';
          }}
        />
        <button
          type="submit"
          disabled={isApplying || !code.trim()}
          aria-label="Apply gift card code"
          style={{
            padding: '12px 20px',
            borderRadius: 'var(--rp-radius)',
            border: '1px solid var(--rp-color-border)',
            backgroundColor: 'var(--rp-color-surface)',
            color: 'var(--rp-color-text)',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--rp-font-family)',
            cursor: isApplying || !code.trim() ? 'not-allowed' : 'pointer',
            opacity: isApplying || !code.trim() ? 0.5 : 1,
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (!isApplying && code.trim()) {
              e.currentTarget.style.backgroundColor = 'var(--rp-color-primary)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'var(--rp-color-primary)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--rp-color-surface)';
            e.currentTarget.style.color = 'var(--rp-color-text)';
            e.currentTarget.style.borderColor = 'var(--rp-color-border)';
          }}
        >
          {isApplying ? 'Applying…' : 'Redeem'}
        </button>
      </form>
      {error && (
        <p role="alert" style={{
          margin: '6px 0 0 0',
          fontSize: '12px',
          color: 'var(--rp-color-error)',
          fontFamily: 'var(--rp-font-family)',
        }}>{error}</p>
      )}
    </div>
  );
}
