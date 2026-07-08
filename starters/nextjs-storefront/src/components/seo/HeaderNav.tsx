"use client";

import { useState } from "react";
import Link from "next/link";
import { ObfuscatedLink } from "@/components/seo/ObfuscatedLink";
import { useCart } from "@/components/CartProvider";

interface HeaderNavProps {
  dict?: Record<string, string>;
}

/** Helper: translate a key or fall back to a default. */
function t(dict: Record<string, string> | undefined, key: string, fallback: string): string {
  return dict?.[key] ?? fallback;
}

/**
 * Client-side navigation for the header.
 *
 * - Desktop: full nav bar with links, search, account, cart
 * - Mobile: cart icon + hamburger → slide-out panel
 */
export function HeaderNav({ dict }: HeaderNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden sm:flex items-center gap-6">
        <Link href="/collections" className="text-sm font-medium hover:text-black/70 transition-colors">
          {t(dict, 'nav.collections', 'Collections')}
        </Link>
        <Link href="/products" className="text-sm font-medium hover:text-black/70 transition-colors">
          {t(dict, 'nav.catalog', 'Catalog')}
        </Link>
        <form method="get" action="/products" className="flex items-center">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input type="search" name="q" placeholder={t(dict, 'nav.search', 'Search…')} className="w-36 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors" />
          </div>
        </form>
        <ObfuscatedLink to="/account" className="text-sm font-medium hover:text-black/70 transition-colors flex items-center gap-1" ariaLabel={t(dict, 'nav.account', 'Account')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        </ObfuscatedLink>
        <ObfuscatedLink to="/cart" className="text-sm font-medium hover:text-black/70 transition-colors flex items-center gap-2" ariaLabel={t(dict, 'nav.cart', 'Cart')}>
          {t(dict, 'nav.cart', 'Cart')}
          {itemCount > 0 && (<span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>)}
        </ObfuscatedLink>
      </nav>

      {/* Mobile: cart + hamburger */}
      <div className="flex sm:hidden items-center gap-3">
        <ObfuscatedLink to="/cart" className="relative" ariaLabel={t(dict, 'nav.cart', 'Cart')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {itemCount > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{itemCount}</span>)}
        </ObfuscatedLink>
        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
          {mobileOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
          )}
        </button>
      </div>

      {/* Mobile slide-out panel */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-2xl z-50 sm:hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-semibold text-lg">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Close menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              <Link href="/collections" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">{t(dict, 'nav.collections', 'Collections')}</Link>
              <Link href="/products" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">{t(dict, 'nav.catalog', 'Catalog')}</Link>
              <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">{t(dict, 'nav.account', 'Account')}</Link>
              <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                {t(dict, 'nav.cart', 'Cart')}
                {itemCount > 0 && (<span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>)}
              </Link>
            </nav>
            <div className="mt-auto p-4 border-t border-gray-100">
              <form method="get" action="/products">
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  <input type="search" name="q" placeholder={t(dict, 'nav.search', 'Search…')} className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-400 focus:outline-none transition-colors" />
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
