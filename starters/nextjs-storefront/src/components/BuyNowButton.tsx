"use client";

import { LoaderCircle, Zap } from "lucide-react";

interface BuyNowButtonProps {
  disabled?: boolean;
  isPending: boolean;
  onClick: () => void;
  size?: "compact" | "full";
}

export function BuyNowButton({
  disabled = false,
  isPending,
  onClick,
  size = "full",
}: BuyNowButtonProps) {
  const compact = size === "compact";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isPending}
      className={
        compact
          ? "w-full px-3 py-2 border border-black text-black text-xs font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          : "w-full py-4 border border-black text-black text-lg font-semibold rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      }
      aria-live="polite"
    >
      {isPending ? (
        <>
          <LoaderCircle className={compact ? "size-4 animate-spin" : "size-5 animate-spin"} aria-hidden="true" />
          Starting checkout…
        </>
      ) : (
        <>
          <Zap className={compact ? "size-4" : "size-5"} aria-hidden="true" />
          Buy now
        </>
      )}
    </button>
  );
}
