/**
 * Store theme/config fetcher.
 *
 * Fetches theme tokens + module flags from the Reponse API (`/v1/theme`).
 * Caches the result in-memory for `CACHE_TTL` ms to avoid redundant
 * requests across renders in the same server process.
 */

import { env } from "@/env";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreModuleConfig {
  active: boolean;
  config: unknown;
}

export interface StoreTheme {
  stripe_publishable_key: string;
  '--rp-color-primary': string;
  '--rp-color-primary-hover': string;
  '--rp-color-background': string;
  '--rp-color-surface': string;
  '--rp-color-border': string;
  '--rp-color-text': string;
  '--rp-color-text-secondary': string;
  '--rp-color-success': string;
  '--rp-color-error': string;
  '--rp-radius': string;
  '--rp-font-family': string;
  '--rp-brand-name': string;
  '--rp-brand-logo': string;
  modules: Record<string, StoreModuleConfig>;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_THEME: StoreTheme = {
  stripe_publishable_key: '',
  '--rp-color-primary': '#111111',
  '--rp-color-primary-hover': '#333333',
  '--rp-color-background': '#f9fafb',
  '--rp-color-surface': '#ffffff',
  '--rp-color-border': '#e5e7eb',
  '--rp-color-text': '#111827',
  '--rp-color-text-secondary': '#6b7280',
  '--rp-color-success': '#16a34a',
  '--rp-color-error': '#dc2626',
  '--rp-radius': '0.75rem',
  '--rp-font-family': 'var(--font-geist-sans), system-ui, sans-serif',
  '--rp-brand-name': env.STORE_NAME,
  '--rp-brand-logo': '',
  modules: {},
};

// ─── Config fetcher ───────────────────────────────────────────────────────────

const apiUrl = env.REPONSE_API_URL;
const workspaceId = env.REPONSE_WORKSPACE_ID;

let cachedConfig: StoreTheme | null = null;
let cacheTime = 0;
const CACHE_TTL = 300_000; // 5 minutes

export async function getStoreConfig(): Promise<StoreTheme> {
  if (cachedConfig && Date.now() - cacheTime < CACHE_TTL) return cachedConfig;

  try {
    const res = await fetch(
      `${apiUrl}/v1/theme?workspace_id=${workspaceId}`,
      { next: { revalidate: 300 } },
    );
    if (!res.ok) throw new Error('Failed to fetch theme');
    const data: StoreTheme = await res.json();
    data.stripe_publishable_key =
      data.stripe_publishable_key || DEFAULT_THEME.stripe_publishable_key;
    // An unconfigured brand name/logo must not erase the local defaults
    data['--rp-brand-name'] = data['--rp-brand-name'] || DEFAULT_THEME['--rp-brand-name'];
    data['--rp-brand-logo'] = data['--rp-brand-logo'] || DEFAULT_THEME['--rp-brand-logo'];
    cachedConfig = data;
    cacheTime = Date.now();
    return cachedConfig;
  } catch {
    // Return defaults when the API is unreachable or returns an error
    return { ...DEFAULT_THEME };
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Check whether a storefront module is active in the config. */
export function isModuleActive(config: StoreTheme, slug: string): boolean {
  return config.modules?.[slug]?.active === true;
}

/** Extract CSS custom-property entries from the theme for inline injection. */
export function themeToStyleVars(
  config: StoreTheme,
): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(config)) {
    if (key.startsWith('--rp-') && typeof value === 'string' && value) {
      vars[key] = value;
    }
  }
  return vars;
}
