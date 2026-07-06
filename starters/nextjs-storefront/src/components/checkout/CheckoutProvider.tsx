'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  currency: string;
  delivery_estimate: { min_days: number; max_days: number };
  is_free: boolean;
}

export interface CheckoutState {
  step: 'contact' | 'shipping' | 'payment';
  cartId: string;
  marketId: string;
  apiUrl: string;
  apiKey: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: Record<string, string> | null;
  selectedShippingRate: ShippingRate | null;
  discountCode: string;
  discountResult: { amount: number; label: string; type: string } | null;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  currency: string;
  items: Array<{
    id: string;
    title: string;
    variant_title: string;
    quantity: number;
    unit_price: number;
    line_price: number;
    image_url: string;
  }>;
  isLoading: boolean;
  error: string | null;
}

export interface CheckoutActions {
  setStep: (step: CheckoutState['step']) => void;
  setContact: (email: string, name: string) => void;
  setShippingAddress: (address: Record<string, string>) => void;
  setShippingRate: (rate: ShippingRate) => void;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => void;
  createPaymentIntent: () => Promise<string>;
}

type CheckoutContextValue = CheckoutState & CheckoutActions;

// ─── Context ───────────────────────────────────────────────────────────────────

const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error('useCheckout must be used within CheckoutProvider');
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────────────────────

interface CheckoutProviderProps {
  cartId: string;
  marketId: string;
  apiUrl: string;
  apiKey: string;
  children: ReactNode;
}

export function CheckoutProvider({ cartId, marketId, apiUrl, apiKey, children }: CheckoutProviderProps) {
  const [state, setState] = useState<CheckoutState>({
    step: 'contact',
    cartId,
    marketId,
    apiUrl,
    apiKey,
    customerEmail: '',
    customerName: '',
    shippingAddress: null,
    selectedShippingRate: null,
    discountCode: '',
    discountResult: null,
    subtotal: 0,
    shippingCost: 0,
    discountAmount: 0,
    total: 0,
    currency: 'EUR',
    items: [],
    isLoading: true,
    error: null,
  });

  const headersRef = useRef({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` });
  const stateRef = useRef(state);
  stateRef.current = state;

  // Recalculate total whenever subtotal, discount, or shipping changes
  const recalculate = useCallback((partial: Partial<CheckoutState>) => {
    setState(prev => {
      const next = { ...prev, ...partial };
      next.total = Math.max(0, next.subtotal - next.discountAmount + next.shippingCost);
      return next;
    });
  }, []);

  // Fetch cart + theme on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const [cartRes, themeRes] = await Promise.all([
          fetch(`${apiUrl}/api/v1/carts/${cartId}`, { headers: { 'Authorization': `Bearer ${apiKey}` } }),
          fetch(`${apiUrl}/api/v1/theme`, { headers: { 'Authorization': `Bearer ${apiKey}` } }),
        ]);

        if (!cartRes.ok) throw new Error('Failed to load cart');
        const cartData = await cartRes.json();
        const cart = cartData.data ?? cartData;

        // Inject theme CSS variables
        if (themeRes.ok) {
          const theme = await themeRes.json();
          const root = document.documentElement;
          Object.entries(theme).forEach(([key, value]) => {
            if (key.startsWith('--rp-')) {
              root.style.setProperty(key, value as string);
            }
          });
        }

        if (cancelled) return;

        const items = (cart.items || []).map((item: any) => ({
          id: item.id,
          title: item.title || item.product_title || '',
          variant_title: item.variant_title || '',
          quantity: item.quantity || 1,
          unit_price: item.unit_price ?? item.price ?? 0,
          line_price: item.line_price ?? (item.unit_price ?? item.price ?? 0) * (item.quantity || 1),
          image_url: item.image_url || item.image || '',
        }));

        const subtotal = items.reduce((acc: number, i: any) => acc + i.line_price, 0);

        recalculate({
          items,
          subtotal,
          currency: cart.currency || 'EUR',
          isLoading: false,
        });
      } catch (err) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to load checkout',
          }));
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [cartId, apiUrl, apiKey, recalculate]);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const setStep = useCallback((step: CheckoutState['step']) => {
    setState(prev => ({ ...prev, step, error: null }));
  }, []);

  const setContact = useCallback((email: string, name: string) => {
    setState(prev => ({
      ...prev,
      customerEmail: email,
      customerName: name,
      step: 'shipping',
      error: null,
    }));
  }, []);

  const setShippingAddress = useCallback((address: Record<string, string>) => {
    setState(prev => ({ ...prev, shippingAddress: address, error: null }));
  }, []);

  const setShippingRate = useCallback((rate: ShippingRate) => {
    recalculate({
      selectedShippingRate: rate,
      shippingCost: rate.is_free ? 0 : rate.price,
      step: 'payment',
    });
  }, [recalculate]);

  const applyDiscount = useCallback(async (code: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const s = stateRef.current;
      const res = await fetch(`${apiUrl}/api/v1/discounts/validate`, {
        method: 'POST',
        headers: headersRef.current,
        body: JSON.stringify({
          code,
          cart_total: s.subtotal,
          cart_quantity: s.items?.length || 0,
          customer_tier: undefined,
          market_id: s.marketId || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Invalid discount code' }));
        throw new Error(err.error || 'Invalid discount code');
      }
      const result = await res.json();
      const discountData = result.data ?? result;
      recalculate({
        discountCode: code,
        discountResult: discountData,
        discountAmount: discountData.amount || 0,
        isLoading: false,
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to apply discount',
        discountCode: '',
        discountResult: null,
        discountAmount: 0,
      }));
      recalculate({ discountCode: '', discountResult: null, discountAmount: 0 });
      throw err;
    }
  }, [apiUrl, recalculate]);

  const removeDiscount = useCallback(() => {
    recalculate({
      discountCode: '',
      discountResult: null,
      discountAmount: 0,
    });
  }, [recalculate]);

  const createPaymentIntent = useCallback(async (): Promise<string> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const s = stateRef.current;
      const res = await fetch(`${apiUrl}/api/v1/checkout/intent`, {
        method: 'POST',
        headers: headersRef.current,
        body: JSON.stringify({
          cart_id: cartId,
          market_id: marketId,
          customer_email: s.customerEmail,
          shipping_address: s.shippingAddress,
          shipping_rate_id: s.selectedShippingRate?.id,
          discount_codes: s.discountCode ? [s.discountCode] : [],
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Payment failed' }));
        throw new Error(err.error || 'Failed to create payment intent');
      }
      const data = await res.json();
      setState(prev => ({ ...prev, isLoading: false }));
      return data.client_secret;
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to create payment',
      }));
      throw err;
    }
  }, [apiUrl, cartId, marketId]);

  const value: CheckoutContextValue = {
    ...state,
    setStep,
    setContact,
    setShippingAddress,
    setShippingRate,
    applyDiscount,
    removeDiscount,
    createPaymentIntent,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}
