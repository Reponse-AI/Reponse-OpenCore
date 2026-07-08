"use client";

import { useState, type FormEvent } from "react";
import { useCartMutations } from "@/hooks/useCartMutations";

export function PromoCodeForm() {
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { applyPromoCode: applyPromo } = useCartMutations();
  const error = localError || (applyPromo.error instanceof Error ? applyPromo.error.message : null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = code.trim();
    setLocalError(null);
    setSuccess(null);

    if (!normalizedCode) {
      setLocalError("Enter a promo code");
      return;
    }

    const result = await applyPromo.mutateAsync(normalizedCode);
    if (!result.success) {
      setLocalError(result.error || "Invalid code");
      return;
    }

    setSuccess(`${result.code || normalizedCode} applied`);
    setCode("");
  };

  return (
    <div className="mt-4 mb-2">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          name="code"
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Promo code"
          autoComplete="off"
          className="flex-1 h-10 px-3 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 uppercase placeholder:normal-case placeholder:text-gray-400 transition-colors"
        />
        <button
          type="submit"
          disabled={applyPromo.isPending}
          className="h-10 px-5 text-sm font-semibold rounded-lg border border-gray-900 bg-white text-gray-900 hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {applyPromo.isPending ? "…" : "Apply"}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">x</span> {error}
        </p>
      )}
      {success && (
        <p className="mt-2 text-sm text-emerald-600 flex items-center gap-1">
          <span>✓</span> {success}
        </p>
      )}
    </div>
  );
}
