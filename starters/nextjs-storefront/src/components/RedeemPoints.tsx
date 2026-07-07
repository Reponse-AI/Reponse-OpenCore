'use client';

import { useState, useTransition } from 'react';
import { formatPrice } from '@/lib/currency';
import { redeemPointsAction } from '@/lib/loyalty-actions';

interface RedeemPointsProps {
  contactId: string;
  pointsBalance: number;
  pointsName: string;
  pointsCurrencyRatio: number;
  currency: string;
}

export function RedeemPoints({
  contactId,
  pointsBalance,
  pointsName,
  pointsCurrencyRatio,
  currency,
}: RedeemPointsProps) {
  const [points, setPoints] = useState('');
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const numericPoints = parseInt(points, 10) || 0;
  const currencyValue = numericPoints * pointsCurrencyRatio;
  const isValid = numericPoints > 0 && numericPoints <= pointsBalance;

  async function handleRedeem() {
    if (!isValid) return;
    setResult(null);

    startTransition(async () => {
      try {
        const data = await redeemPointsAction(contactId, numericPoints);

        if (!data.success) {
          setResult({ success: false, message: data.error || 'Failed to redeem points' });
          return;
        }

        setResult({
          success: true,
          message: `Successfully redeemed ${data.points_redeemed ?? numericPoints} ${pointsName}!`,
        });
        setPoints('');
      } catch {
        setResult({ success: false, message: 'Something went wrong' });
      }
    });
  }

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: 'var(--rp-radius)',
        backgroundColor: 'var(--rp-color-surface)',
        border: '1px solid var(--rp-color-border)',
        fontFamily: 'var(--rp-font-family)',
      }}
    >
      <h2
        style={{
          fontSize: '16px',
          fontWeight: 700,
          margin: '0 0 16px 0',
          color: 'var(--rp-color-text)',
        }}
      >
        Redeem {pointsName}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label
            htmlFor="redeem-points"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--rp-color-text-secondary)',
              marginBottom: '4px',
            }}
          >
            Points to redeem (max {pointsBalance.toLocaleString()})
          </label>
          <input
            id="redeem-points"
            type="number"
            min="1"
            max={pointsBalance}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Enter points"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: 'var(--rp-radius)',
              border: '1px solid var(--rp-color-border)',
              backgroundColor: 'var(--rp-color-background)',
              fontFamily: 'var(--rp-font-family)',
              outline: 'none',
            }}
          />
        </div>

        {numericPoints > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: 'var(--rp-radius)',
              backgroundColor: 'var(--rp-color-background)',
            }}
          >
            <span style={{ color: 'var(--rp-color-text-secondary)' }}>Value</span>
            <span style={{ fontWeight: 600, color: 'var(--rp-color-primary)' }}>
              {formatPrice(currencyValue, currency)}
            </span>
          </div>
        )}

        {numericPoints > pointsBalance && (
          <p style={{ fontSize: '13px', color: 'var(--rp-color-error)', margin: 0 }}>
            You don&apos;t have enough {pointsName}
          </p>
        )}

        {result && (
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--rp-radius)',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: result.success
                ? 'color-mix(in srgb, var(--rp-color-success) 10%, transparent)'
                : 'color-mix(in srgb, var(--rp-color-error) 10%, transparent)',
              color: result.success ? 'var(--rp-color-success)' : 'var(--rp-color-error)',
            }}
          >
            {result.message}
          </div>
        )}

        <button
          type="button"
          disabled={!isValid || isPending}
          onClick={handleRedeem}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: 'var(--rp-radius)',
            border: 'none',
            cursor: isValid && !isPending ? 'pointer' : 'not-allowed',
            backgroundColor: isValid && !isPending ? 'var(--rp-color-primary)' : 'var(--rp-color-border)',
            color: isValid && !isPending ? '#fff' : 'var(--rp-color-text-secondary)',
            fontFamily: 'var(--rp-font-family)',
            transition: 'background-color 0.15s',
          }}
        >
          {isPending ? 'Redeeming…' : `Redeem ${numericPoints > 0 ? numericPoints.toLocaleString() : ''} ${pointsName}`}
        </button>
      </div>
    </div>
  );
}
