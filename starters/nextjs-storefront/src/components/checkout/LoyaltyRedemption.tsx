'use client';

import { useState, FormEvent } from 'react';
import { formatPrice } from '@/lib/currency';
import { useLoyaltyRedemption } from '@/hooks/useCheckoutApi';

interface LoyaltyRedemptionProps {
  contactId: string;
  currency: string;
}

export function LoyaltyRedemption({ contactId, currency }: LoyaltyRedemptionProps) {
  const [pointsToRedeem, setPointsToRedeem] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState<{ points: number; value: number } | null>(null);
  const loyalty = useLoyaltyRedemption(contactId);
  const program = loyalty.program.data ?? null;
  const balance = loyalty.balance.data ?? null;
  const isLoading = loyalty.program.isLoading || loyalty.balance.isLoading;

  if (isLoading || !program || !balance || balance.points_balance <= 0) {
    return null;
  }

  const pointsNum = parseInt(pointsToRedeem, 10);
  const isValidPoints = !isNaN(pointsNum) && pointsNum > 0 && pointsNum <= balance.points_balance;
  const redemptionValue = isValidPoints ? pointsNum * program.points_currency_ratio : 0;

  if (redeemed) {
    return (
      <div style={{
        padding: '14px 16px',
        borderRadius: 'var(--rp-radius)',
        backgroundColor: 'color-mix(in srgb, var(--rp-color-success) 8%, transparent)',
        border: '1px solid color-mix(in srgb, var(--rp-color-success) 25%, transparent)',
        fontFamily: 'var(--rp-font-family)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ fontSize: '16px' }}>🏆</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--rp-color-text)' }}>
            {redeemed.points} {program.points_name} redeemed
          </div>
          <div style={{ fontSize: '12px', color: 'var(--rp-color-success)', fontWeight: 500 }}>
            −{formatPrice(redeemed.value, currency)} applied
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValidPoints) return;

    setError(null);

    try {
      const data = await loyalty.redeem.mutateAsync({ points: pointsNum });
      setRedeemed({
        points: pointsNum,
        value: data.currency_value ?? redemptionValue,
      });
      setPointsToRedeem('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem points');
    }
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: 'var(--rp-radius)',
      backgroundColor: 'color-mix(in srgb, var(--rp-color-primary) 4%, transparent)',
      border: '1px solid color-mix(in srgb, var(--rp-color-primary) 15%, transparent)',
      fontFamily: 'var(--rp-font-family)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--rp-color-text)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span>🏆</span>
          Use Your {program.points_name}
        </div>
        <div style={{
          fontSize: '13px',
          color: 'var(--rp-color-text-secondary)',
        }}>
          {balance.points_balance.toLocaleString()} available ({formatPrice(balance.currency_value, currency)})
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="number"
          min={1}
          max={balance.points_balance}
          value={pointsToRedeem}
          onChange={(e) => { setPointsToRedeem(e.target.value); setError(null); }}
          placeholder={`Max ${balance.points_balance}`}
          aria-label={`${program.points_name} to redeem`}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 'var(--rp-radius)',
            border: '1px solid var(--rp-color-border)',
            backgroundColor: 'var(--rp-color-surface)',
            color: 'var(--rp-color-text)',
            fontFamily: 'var(--rp-font-family)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box' as const,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--rp-color-primary)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--rp-color-border)'; }}
        />
        <button
          type="submit"
          disabled={loyalty.redeem.isPending || !isValidPoints}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--rp-radius)',
            border: 'none',
            backgroundColor: 'var(--rp-color-primary)',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: 600,
            fontFamily: 'var(--rp-font-family)',
            cursor: loyalty.redeem.isPending || !isValidPoints ? 'not-allowed' : 'pointer',
            opacity: loyalty.redeem.isPending || !isValidPoints ? 0.5 : 1,
            transition: 'opacity 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {loyalty.redeem.isPending ? 'Redeeming…' : 'Redeem'}
        </button>
      </form>

      {isValidPoints && redemptionValue > 0 && (
        <p style={{
          margin: '6px 0 0 0',
          fontSize: '12px',
          color: 'var(--rp-color-primary)',
          fontWeight: 500,
        }}>
          = {formatPrice(redemptionValue, currency)} discount
        </p>
      )}

      {error && (
        <p role="alert" style={{
          margin: '6px 0 0 0',
          fontSize: '12px',
          color: 'var(--rp-color-error)',
        }}>{error}</p>
      )}
    </div>
  );
}
