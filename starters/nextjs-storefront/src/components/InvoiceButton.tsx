"use client";

import { useState, useCallback, useTransition } from "react";
import { resendInvoice } from "@/lib/orders";

interface InvoiceButtonProps {
  orderId: string;
  financialStatus: string;
}

export function InvoiceButton({
  orderId,
  financialStatus,
}: InvoiceButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleResendInvoice = useCallback(async () => {
    setMessage(null);

    startTransition(async () => {
      const ok = await resendInvoice(orderId);
      if (ok) {
        setMessage({
          type: "success",
          text: "Invoice sent to your email!",
        });
      } else {
        setMessage({
          type: "error",
          text: "Failed to send invoice. Please try again.",
        });
      }
    });
  }, [orderId]);

  // Only show for paid orders
  if (financialStatus !== "paid") return null;

  return (
    <div>
      {message && (
        <div
          className={`mb-3 p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 border border-green-100 text-green-700"
              : "bg-red-50 border border-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <button
        onClick={handleResendInvoice}
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
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        {isPending ? "Sending…" : "Send invoice"}
      </button>
    </div>
  );
}
