import Link from "next/link";
import Image from "next/image";
import { HeaderNav } from "@/components/seo/HeaderNav";
import { LocaleSelector } from "@/components/LocaleSelector";
import type { Locale } from "@/lib/i18n";

interface HeaderProps {
  storeName: string;
  logoUrl: string;
  locale: Locale;
  dict: Record<string, string>;
}

export function Header({ storeName, logoUrl, locale, dict }: HeaderProps) {
  return (
    <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10 text-[var(--rp-color-text)] font-[family-name:var(--font-geist-sans)]">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={storeName}
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
            unoptimized
          />
        ) : null}
        <span>{storeName}</span>
      </Link>
      <div className="flex items-center gap-4">
        <HeaderNav dict={dict} />
        <LocaleSelector currentLocale={locale} />
      </div>
    </header>
  );
}
