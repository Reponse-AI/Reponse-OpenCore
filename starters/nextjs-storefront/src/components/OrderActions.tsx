"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cancelOrder, resendOrderConfirmation } from "@/lib/orders";

interface OrderActionsProps {
  orderId: string;
  isCancellable: boolean;
}

export function OrderActions({ orderId, isCancellable }: OrderActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCancel = useCallback(async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setMessage(null);

    startTransition(async () => {
      const ok = await cancelOrder(orderId);
      if (ok) {
        setMessage({ type: "success", text: "Order cancelled successfully." });
        router.refresh();
      } else {
        setMessage({ type: "error", text: "Failed to cancel order." });
      }
    });
  }, [orderId, router]);

  const handleResend = useCallback(async () => {
    setMessage(null);

    startTransition(async () => {
      const ok = await resendOrderConfirmation(orderId);
      if (ok) {
        setMessage({ type: "success", text: "Confirmation email sent!" });
      } else {
        setMessage({ type: "error", text: "Failed to resend confirmation." });
      }
    });
  }, [orderId]);

  return (
    <div>
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-100 text-green-700"
              : "bg-red-50 border border-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleResend}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          {isPending ? "Sending…" : "Resend confirmation"}
        </button>

        {isCancellable && (
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
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
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            {isPending ? "Cancelling…" : "Cancel order"}
          </button>
        )}
      </div>
    </div>
  );
}
