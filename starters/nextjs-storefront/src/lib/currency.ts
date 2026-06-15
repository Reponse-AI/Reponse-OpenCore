export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar ($)" },
  { code: "EUR", symbol: "€", label: "Euro (€)" },
  { code: "GBP", symbol: "£", label: "British Pound (£)" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar (CA$)" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar (A$)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (¥)" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc (CHF)" },
  { code: "SEK", symbol: "kr", label: "Swedish Krona (kr)" },
  { code: "DKK", symbol: "kr", label: "Danish Krone (kr)" },
  { code: "NOK", symbol: "kr", label: "Norwegian Krone (kr)" },
  { code: "PLN", symbol: "zł", label: "Polish Zloty (zł)" },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]["code"];

export function getCurrencySymbol(code: string | null | undefined): string {
  if (!code) return "$"; // Default to USD
  const currency = CURRENCIES.find((c) => c.code === code);
  return currency ? currency.symbol : "$";
}

export function formatMoney(amount: string | number, currencyCode: string | null | undefined, locale: string = "fr-FR"): string {
  if (amount === "" || amount === undefined || amount === null) return "";
  
  const numericValue = typeof amount === "string" ? Number(amount.replace(/[^0-9.,-]/g, "").replace(",", ".")) : amount;

  if (isNaN(numericValue)) return String(amount);

  const currency = currencyCode || "USD";

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(numericValue);
}

// Alias to avoid breaking existing code that calls formatPrice
export function formatPrice(amount: string | number, currencyCode: string | null | undefined, locale?: string): string {
  return formatMoney(amount, currencyCode, locale);
}
