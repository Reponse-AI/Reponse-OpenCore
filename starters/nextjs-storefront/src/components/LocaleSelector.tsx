"use client";

import { useCallback, useState } from "react";
import { type Locale, locales, LOCALE_COOKIE } from "@/lib/i18n";

interface LocaleSelectorProps {
  currentLocale: Locale;
}

/**
 * Language selector dropdown.
 * Sets a cookie and reloads the page on locale change.
 */
export function LocaleSelector({ currentLocale }: LocaleSelectorProps) {
  const [open, setOpen] = useState(false);

  const switchLocale = useCallback((locale: Locale) => {
    // Set cookie with 1-year expiry
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    setOpen(false);
    window.location.reload();
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "4px 8px",
          fontSize: 13,
          fontWeight: 500,
          color: "#374151",
          background: "transparent",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          cursor: "pointer",
          lineHeight: 1,
          transition: "border-color 0.15s",
        }}
      >
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
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {currentLocale.toUpperCase()}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "calc(100% + 4px)",
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 50,
              minWidth: 80,
              overflow: "hidden",
            }}
          >
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => switchLocale(locale)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: locale === currentLocale ? 600 : 400,
                  color: locale === currentLocale ? "#111" : "#6b7280",
                  background: locale === currentLocale ? "#f3f4f6" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => {
                  if (locale !== currentLocale) {
                    (e.target as HTMLButtonElement).style.background = "#f9fafb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (locale !== currentLocale) {
                    (e.target as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
