'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { readJsonResult } from '@/lib/api/response';
import { queryKeys } from '@/lib/api/query-keys';
import type { ShippingRate } from '@/types/storefront';

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
  const [selectedRateOverride, setSelectedRate] = useState<ShippingRate | null>(null);
  const [manualError, setError] = useState<string | null>(null);

  const ratesQuery = useQuery({
    queryKey: queryKeys.checkout.shippingRates(cartId, country),
    enabled,
    queryFn: async ({ signal }) => {
      const params = new URLSearchParams({
        country,
        cart_id: cartId,
      });
      if (marketId) params.set('market_id', marketId);

      const response = await fetch(`${apiUrl}/v1/shipping/rates?${params.toString()}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal,
      });
      const payload = await readJsonResult<unknown>(response, 'Failed to fetch shipping rates');
      return normalizeShippingRatesResponse(payload);
    },
  });

  const rates = useMemo(() => ratesQuery.data ?? [], [ratesQuery.data]);
  const selectedRate = selectedRateOverride ?? (rates.length === 1 ? rates[0] : null);
  const error = manualError ?? (ratesQuery.error instanceof Error ? ratesQuery.error.message : null);

  return {
    rates,
    selectedRate,
    setSelectedRate,
    loadingRates: ratesQuery.isFetching,
    error,
    setError,
    refetch: async () => {
      await ratesQuery.refetch();
    },
  };
}
