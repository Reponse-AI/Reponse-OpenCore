"use client";

import { useActionState } from "react";
import { applyPromoCode, type PromoResult } from "@/lib/cart";
import { useRouter } from "next/navigation";

type FormState = {
  error?: string;
  success?: string;
};

export function PromoCodeForm() {
  const router = useRouter();

  async function handleApply(
    _prev: FormState,
    formData: FormData
  ): Promise<FormState> {
    const code = (formData.get("code") as string)?.trim();
    if (!code) return { error: "Enter a promo code" };

    const result: PromoResult = await applyPromoCode(code);
    if (!result.success) {
      return { error: result.error || "Invalid code" };
    }

    router.refresh();
    return { success: `${result.code} applied` };
  }

  const [state, formAction, pending] = useActionState(handleApply, {});

  return (
    <div className="mt-4 mb-2">
      <form action={formAction} className="flex gap-2">
        <input
          name="code"
          type="text"
          placeholder="Promo code"
          autoComplete="off"
          className="flex-1 h-10 px-3 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 uppercase placeholder:normal-case placeholder:text-gray-400 transition-colors"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-10 px-5 text-sm font-semibold rounded-lg border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "…" : "Apply"}
        </button>
      </form>
      {state.error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">✕</span> {state.error}
        </p>
      )}
      {state.success && (
        <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
          <span>✓</span> {state.success}
        </p>
      )}
    </div>
  );
}
