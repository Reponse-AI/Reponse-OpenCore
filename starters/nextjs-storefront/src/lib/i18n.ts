/**
 * Lightweight i18n system for the standalone storefront.
 *
 * Uses dynamic imports for dictionary JSON files so only the active locale
 * is bundled into the page. Locale is resolved server-side from a cookie
 * or the Accept-Language header (see layout.tsx).
 */

export type Locale = 'en' | 'fr';
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'fr'];

/** Cookie name used to persist the user's locale preference. */
export const LOCALE_COOKIE = 'reponse_locale';

const dictionaries: Record<Locale, () => Promise<Record<string, string>>> = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  fr: () => import('@/dictionaries/fr.json').then((m) => m.default),
};

/**
 * Load the dictionary for the given locale.
 * Returns a flat key→translation map.
 */
export async function getDictionary(locale: Locale): Promise<Record<string, string>> {
  const loader = dictionaries[locale];
  if (!loader) return dictionaries[defaultLocale]();
  return loader();
}

/**
 * Helper: translate a key using a pre-loaded dictionary.
 * Falls back to the key itself if no translation is found.
 */
export function t(dict: Record<string, string>, key: string): string {
  return dict[key] ?? key;
}

/**
 * Parse a locale string (e.g. from Accept-Language) into a supported Locale.
 */
export function parseLocale(raw: string | undefined | null): Locale {
  if (!raw) return defaultLocale;
  const lower = raw.toLowerCase().trim();
  if (lower.startsWith('fr')) return 'fr';
  return 'en';
}
