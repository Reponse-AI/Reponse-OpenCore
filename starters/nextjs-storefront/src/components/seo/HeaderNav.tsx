"use client";

import Link from "next/link";
import { ObfuscatedLink } from "@/components/seo/ObfuscatedLink";

interface HeaderNavProps {
  itemCount: number;
}

/**
 * Client-side navigation for the header.
 *
 * - Catalog link → standard `<Link>` (crawlable by Google ✅)
 * - Cart link → `<ObfuscatedLink>` (hidden from crawlers, no SEO value)
 */
export function HeaderNav({ itemCount }: HeaderNavProps) {
  return (
    <nav className="flex gap-6">
      <Link
        href="/products"
        className="text-sm font-medium hover:text-black/70 transition-colors"
      >
        Catalog
      </Link>
      <ObfuscatedLink
        to="/cart"
        className="text-sm font-medium hover:text-black/70 transition-colors flex items-center gap-2"
        ariaLabel="View shopping cart"
      >
        Cart
        {itemCount > 0 && (
          <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {itemCount}
          </span>
        )}
      </ObfuscatedLink>
    </nav>
  );
}
