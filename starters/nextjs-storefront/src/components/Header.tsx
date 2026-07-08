import Link from "next/link";
import Image from "next/image";
import { cookies, headers } from "next/headers";
import { getCart } from "@/lib/cart";
import { getStoreConfig } from "@/lib/config";
import { HeaderNav } from "@/components/seo/HeaderNav";
import { LocaleSelector } from "@/components/LocaleSelector";
import { type Locale, defaultLocale, parseLocale, getDictionary, LOCALE_COOKIE } from "@/lib/i18n";

/** Resolve locale from cookie or Accept-Language header. */
async function resolveLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE)?.value;
  if (localeCookie) return parseLocale(localeCookie);

  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";
  return parseLocale(acceptLang);
}

export async function Header() {
  const [cart, config, locale] = await Promise.all([
    getCart(),
    getStoreConfig(),
    resolveLocale(),
  ]);
  const dict = await getDictionary(locale);

  const itemCount =
    cart?.items?.reduce(
      (total: number, item: { quantity: number }) => total + item.quantity,
      0,
    ) || 0;

  const storeName = config["--rp-brand-name"] || "Store";
  const logoUrl = config["--rp-brand-logo"] || "";

  return (
    <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
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
        <HeaderNav itemCount={itemCount} dict={dict} />
        <LocaleSelector currentLocale={locale} />
      </div>
    </header>
  );
}
