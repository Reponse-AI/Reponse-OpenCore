"use client";

import { useState, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getEnv(): { apiUrl: string; workspaceId: string } {
  if (typeof window !== "undefined" && (globalThis as Record<string, unknown>).__ENV) {
    const env = (globalThis as Record<string, unknown>).__ENV as Record<string, string>;
    return {
      apiUrl: env.REPONSE_API_URL || "https://reponse.ai/api",
      workspaceId: env.REPONSE_WORKSPACE_ID || "",
    };
  }
  return { apiUrl: "https://reponse.ai/api", workspaceId: "" };
}

function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "paid":
    case "fulfilled":
    case "delivered":
    case "completed":
      return "bg-green-50 text-green-700 border-green-100";
    case "pending":
    case "partially_fulfilled":
    case "in_transit":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "cancelled":
    case "refunded":
    case "failed":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Lookup result type (subset of Order returned by /v1/orders/lookup) ─────

interface LookupResult {
  id: string;
  order_number: string | null;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: number;
  currency: string;
  email: string;
  created_at: string;
  shipping_address: Record<string, string | null> | null;
  tracking_number: string | null;
  tracking_url: string | null;
}

function OrderResult({ order }: { order: LookupResult }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-gray-900 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white text-lg font-semibold">
              Order #{order.order_number}
            </h2>
            <p className="text-white/60 text-sm mt-0.5">
              Placed{" "}
              {new Date(order.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.financial_status)}`}
            >
              {formatStatus(order.financial_status)}
            </span>
          </div>
        </div>
      </div>

      {/* Status details */}
      <div className="p-8 space-y-6">
        {/* Payment + Fulfillment status */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Payment
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(order.financial_status)}`}
            >
              {formatStatus(order.financial_status)}
            </span>
          </div>
          {order.fulfillment_status && (
            <div className="flex-1">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Fulfillment
              </h3>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(order.fulfillment_status)}`}
              >
                {formatStatus(order.fulfillment_status)}
              </span>
            </div>
          )}
        </div>

        {/* Tracking */}
        {order.tracking_number && (
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Tracking Information
            </h3>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="16" height="13" x="6" y="4" rx="2" />
                  <path d="m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" />
                  <path d="M2 8v11a2 2 0 0 0 2 2h2" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Shipment</p>
                <p className="text-sm text-gray-500">
                  {order.tracking_url ? (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {order.tracking_number}
                    </a>
                  ) : (
                    <span className="font-mono">{order.tracking_number}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order total */}
        <div>
          <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            Total
          </h3>
          <p className="text-xl font-bold">
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: order.currency || "EUR",
            }).format(order.total_price)}
          </p>
        </div>

        {/* Shipping address */}
        {order.shipping_address && (
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Shipping Address
            </h3>
            <div className="text-sm text-gray-600">
              {order.shipping_address.first_name && (
                <p className="font-medium">
                  {order.shipping_address.first_name}{" "}
                  {order.shipping_address.last_name}
                </p>
              )}
              {order.shipping_address.address1 && (
                <p>{order.shipping_address.address1}</p>
              )}
              {order.shipping_address.city && (
                <p>
                  {order.shipping_address.city}
                  {order.shipping_address.zip ? `, ${order.shipping_address.zip}` : ""}
                </p>
              )}
              {order.shipping_address.country && (
                <p>{order.shipping_address.country}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lookup form ──────────────────────────────────────────────────────────────

export function TrackOrderForm() {
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<LookupResult | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setOrder(null);
      setLoading(true);

      try {
        const { apiUrl, workspaceId } = getEnv();
        const params = new URLSearchParams({
          email,
          order_number: orderNumber,
        });
        const res = await fetch(`${apiUrl}/v1/orders/lookup?${params}`, {
          headers: { "x-workspace-id": workspaceId },
        });

        if (res.status === 404) {
          setError(
            "Order not found. Please check your email and order number."
          );
          return;
        }

        if (!res.ok) {
          setError("Something went wrong. Please try again.");
          return;
        }

        const data = (await res.json()) as LookupResult;
        setOrder(data);
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [email, orderNumber]
  );

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="track-email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="track-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="track-order-number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Order number
            </label>
            <input
              id="track-order-number"
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. 1042"
              className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !orderNumber}
            className="w-full h-11 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Looking up…
              </>
            ) : (
              "Track Order"
            )}
          </button>
        </form>
      </div>

      {order && <OrderResult order={order} />}
    </>
  );
}
