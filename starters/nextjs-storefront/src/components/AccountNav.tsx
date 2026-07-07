'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export interface AccountNavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

export function AccountNav({ items }: { items: AccountNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-0.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/account' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl transition-colors ${
              isActive
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className={isActive ? 'text-gray-700' : 'text-gray-400'}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
