"use client";

import Link from "next/link";
import { ObfuscatedLink } from "@/components/seo/ObfuscatedLink";

interface HeaderNavProps {
  itemCount: number;
  dict?: Record<string, string>;
}

/** Helper: translate a key or fall back to a default. */
function t(dict: Record<string, string> | undefined, key: string, fallback: string): string {
  return dict?.[key] ?? fallback;
}

/**
 * Client-side navigation for the header.
 *
 * - Collections link → standard `<Link>` (crawlable by Google ✅)
 * - Catalog link → standard `<Link>` (crawlable by Google ✅)
 * - Search form → SSR-friendly GET form to /products?q=
 * - Cart link → `<ObfuscatedLink>` (hidden from crawlers, no SEO value)
 */
export function HeaderNav({ itemCount, dict }: HeaderNavProps) {
  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/collections"
        className="text-sm font-medium hover:text-black/70 transition-colors"
      >
        {t(dict, "nav.collections", "Collections")}
      </Link>
      <Link
        href="/products"
        className="text-sm font-medium hover:text-black/70 transition-colors"
      >
        {t(dict, "nav.catalog", "Catalog")}
      </Link>

      {/* SSR-friendly search — GET form navigates to /products?q=<query> */}
      <form
        method="get"
        action="/products"
        className="hidden sm:flex items-center"
      >
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            name="q"
            placeholder={t(dict, "nav.search", "Search…")}
            className="w-36 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors"
          />
        </div>
      </form>

      <ObfuscatedLink
        to="/account"
        className="text-sm font-medium hover:text-black/70 transition-colors flex items-center gap-1"
        ariaLabel={t(dict, "nav.account", "Account")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </ObfuscatedLink>

      <ObfuscatedLink
        to="/cart"
        className="text-sm font-medium hover:text-black/70 transition-colors flex items-center gap-2"
        ariaLabel={t(dict, "nav.cart", "Cart")}
      >
        {t(dict, "nav.cart", "Cart")}
        {itemCount > 0 && (
          <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </ObfuscatedLink>
    </nav>
  );
}
