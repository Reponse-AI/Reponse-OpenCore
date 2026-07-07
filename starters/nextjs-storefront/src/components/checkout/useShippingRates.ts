'use client';

import { useCallback, useEffect, useState } from 'react';
import { ShippingRate } from './CheckoutProvider';

interface UseShippingRatesParams {
  apiUrl: string;
  apiKey: string;
  cartId: string;
  marketId?: string | null;
  country: string;
  enabled: boolean;
}

interface UseShippingRatesResult {
  rates: ShippingRate[];
  selectedRate: ShippingRate | null;
  setSelectedRate: (rate: ShippingRate | null) => void;
  loadingRates: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  refetch: () => Promise<void>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function optionalNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function optionalBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}

function normalizeRate(
  value: unknown,
  profile?: { id?: string; name?: string },
): ShippingRate | null {
  if (!isRecord(value)) return null;

  const id = optionalString(value.rate_id) ?? optionalString(value.id);
  const name = optionalString(value.name);
  const price = optionalNumber(value.price);
  if (!id || !name || price === null) return null;

  const estimate = isRecord(value.delivery_estimate)
    ? {
        min_days: optionalNumber(value.delivery_estimate.min_days),
        max_days: optionalNumber(value.delivery_estimate.max_days),
      }
    : undefined;

  return {
    id,
    profile_id: profile?.id,
    profile_name: profile?.name,
    name,
    price,
    currency: optionalString(value.currency) ?? 'EUR',
    delivery_estimate: estimate,
    is_free: optionalBoolean(value.is_free) ?? price === 0,
  };
}

function normalizeFlatRates(value: unknown): ShippingRate[] {
  if (!Array.isArray(value)) return [];

  return value.reduce<ShippingRate[]>((acc, item) => {
    const rate = normalizeRate(item);
    if (rate) acc.push(rate);
    return acc;
  }, []);
}

export function normalizeShippingRatesResponse(payload: unknown): ShippingRate[] {
  if (Array.isArray(payload)) return normalizeFlatRates(payload);
  if (!isRecord(payload)) return [];

  if (Array.isArray(payload.profiles)) {
    return payload.profiles.reduce<ShippingRate[]>((acc, profileValue) => {
      if (!isRecord(profileValue) || !Array.isArray(profileValue.rates)) {
        return acc;
      }

      const profile = {
        id: optionalString(profileValue.profile_id),
        name: optionalString(profileValue.profile_name),
      };

      for (const rateValue of profileValue.rates) {
        const rate = normalizeRate(rateValue, profile);
        if (rate) acc.push(rate);
      }

      return acc;
    }, []);
  }

  const dataRates = normalizeFlatRates(payload.data);
  if (dataRates.length > 0) return dataRates;
  return normalizeFlatRates(payload.rates);
}

export function formatDeliveryEstimate(rate: ShippingRate): string | null {
  const estimate = rate.delivery_estimate;
  if (!estimate) return null;

  const minDays = estimate.min_days;
  const maxDays = estimate.max_days;
  if (minDays !== null && maxDays !== null) {
    return `${minDays}-${maxDays} business days`;
  }
  if (maxDays !== null) return `Up to ${maxDays} business days`;
  if (minDays !== null) return `From ${minDays} business days`;
  return null;
}

export function useShippingRates({
  apiUrl,
  apiKey,
  cartId,
  marketId,
  country,
  enabled,
}: UseShippingRatesParams): UseShippingRatesResult {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) return;

      await Promise.resolve();
      if (signal?.aborted) return;

      setLoadingRates(true);
      setError(null);
      setSelectedRate(null);

      try {
        const params = new URLSearchParams({
          country,
          cart_id: cartId,
        });
        if (marketId) params.set('market_id', marketId);

        const res = await fetch(`${apiUrl}/v1/shipping/rates?${params.toString()}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal,
        });

        if (!res.ok) {
          const fallback = 'Failed to fetch shipping rates';
          const errorPayload: unknown = await res.json().catch(() => null);
          const message = isRecord(errorPayload) ? optionalString(errorPayload.error) : undefined;
          throw new Error(message ?? fallback);
        }

        const payload: unknown = await res.json();
        const nextRates = normalizeShippingRatesResponse(payload);
        setRates(nextRates);
        setSelectedRate(nextRates.length === 1 ? nextRates[0] : null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Failed to load shipping rates');
        setRates([]);
      } finally {
        if (!signal?.aborted) setLoadingRates(false);
      }
    },
    [apiKey, apiUrl, cartId, country, enabled, marketId],
  );

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void fetchRates(controller.signal);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [enabled, fetchRates]);

  return {
    rates,
    selectedRate,
    setSelectedRate,
    loadingRates,
    error,
    setError,
    refetch: () => fetchRates(),
  };
}
