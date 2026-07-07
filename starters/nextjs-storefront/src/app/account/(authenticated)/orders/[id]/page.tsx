import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getContactId } from "@/lib/auth";
import { getOrdersByContact } from "@/lib/orders";
import { formatMoney } from "@/lib/currency";
import { OrderActions } from "@/components/OrderActions";
import type { Order } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Order Details",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "paid":
    case "fulfilled":
    case "delivered":
    case "completed":
      return "bg-green-50 text-green-700";
    case "pending":
    case "partially_fulfilled":
    case "in_transit":
      return "bg-amber-50 text-amber-700";
    case "cancelled":
    case "refunded":
    case "failed":
      return "bg-red-50 text-red-700";
    default:
      return "bg-gray-50 text-gray-600";
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatAddress(addr: Order["shipping_address"]): string {
  if (!addr) return "";
  return [
    [addr.first_name, addr.last_name].filter(Boolean).join(" "),
    addr.address1,
    addr.address2,
    [addr.city, addr.province, addr.zip].filter(Boolean).join(", "),
    addr.country,
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contactId = await getContactId();

  if (!contactId) {
    redirect("/account/login");
  }

  // Fetch all orders and find the matching one (no separate single-order endpoint yet)
  const orders = await getOrdersByContact(contactId);
  const order = orders.find((o) => o.id === id);

  if (!order) notFound();

  const isCancellable =
    !order.cancelled_at &&
    order.financial_status !== "refunded" &&
    order.fulfillment_status !== "fulfilled";

  return (
    <div>
      {/* Back to orders */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
      >
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
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Order #{order.order_number}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
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
          {order.fulfillment_status && (
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.fulfillment_status)}`}
            >
              {formatStatus(order.fulfillment_status)}
            </span>
          )}
          {order.cancelled_at && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
              Cancelled
            </span>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Line items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Items</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.line_items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-6">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.title}
                  </p>
                  {item.variant_title && (
                    <p className="text-xs text-gray-400">{item.variant_title}</p>
                  )}
                  {item.sku && (
                    <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    × {item.quantity}
                  </p>
                  <p className="font-medium text-gray-900">
                    {formatMoney(item.total_price, order.currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-gray-100 p-6 space-y-2 bg-gray-50/50">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>
                {formatMoney(order.subtotal_price, order.currency)}
              </span>
            </div>
            {order.total_shipping > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span>
                  {formatMoney(order.total_shipping, order.currency)}
                </span>
              </div>
            )}
            {order.total_tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span>
                  {formatMoney(order.total_tax, order.currency)}
                </span>
              </div>
            )}
            {order.total_discounts > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discounts</span>
                <span className="text-green-600">
                  -{formatMoney(order.total_discounts, order.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>{formatMoney(order.total_price, order.currency)}</span>
            </div>
          </div>
        </div>

        {/* Tracking info */}
        {order.fulfillments.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Tracking</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {order.fulfillments.map((f) => (
                <div key={f.id} className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(f.status)}`}
                    >
                      {formatStatus(f.status)}
                    </span>
                    {f.tracking_company && (
                      <span className="text-sm text-gray-500">
                        {f.tracking_company}
                      </span>
                    )}
                  </div>
                  {f.tracking_number && (
                    <p className="text-sm text-gray-600">
                      Tracking:{" "}
                      {f.tracking_url ? (
                        <a
                          href={f.tracking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {f.tracking_number}
                        </a>
                      ) : (
                        <span className="font-mono">{f.tracking_number}</span>
                      )}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(f.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping address */}
        {order.shipping_address && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Shipping Address</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {formatAddress(order.shipping_address)}
              </p>
              {order.shipping_address.phone && (
                <p className="text-sm text-gray-400 mt-2">
                  {order.shipping_address.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <OrderActions
          orderId={order.id}
          isCancellable={isCancellable}
        />

        {/* Note */}
        {order.note && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-2">Note</h2>
            <p className="text-sm text-gray-600">{order.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
