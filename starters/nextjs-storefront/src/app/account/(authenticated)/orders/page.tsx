import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getContactId } from "@/lib/auth";
import { getOrdersByContact } from "@/lib/orders";
import { formatMoney } from "@/lib/currency";

export const metadata: Metadata = {
  title: "My Orders",
};

// ─── Status badge colors ─────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function OrdersPage() {
  const contactId = await getContactId();

  if (!contactId) {
    redirect("/account/login");
  }

  const orders = await getOrdersByContact(contactId);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-gray-300 mb-4">
            <svg
              className="mx-auto"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <p className="text-gray-500 mb-4">You don&apos;t have any orders yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-gray-200 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-gray-900">
                      Order #{order.order_number}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(order.financial_status)}`}
                    >
                      {formatStatus(order.financial_status)}
                    </span>
                    {order.fulfillment_status && (
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(order.fulfillment_status)}`}
                      >
                        {formatStatus(order.fulfillment_status)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <time dateTime={order.created_at}>
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                    <span>
                      {order.line_items.length} item
                      {order.line_items.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900">
                    {formatMoney(order.total_price, order.currency)}
                  </span>
                  <svg
                    className="text-gray-300 group-hover:text-gray-500 transition-colors"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
