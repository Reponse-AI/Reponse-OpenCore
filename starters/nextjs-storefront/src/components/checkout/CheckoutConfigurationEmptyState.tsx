import Link from "next/link";

interface CheckoutConfigurationEmptyStateProps {
  paymentsSettingsUrl: string;
}

export function CheckoutConfigurationEmptyState({
  paymentsSettingsUrl,
}: CheckoutConfigurationEmptyStateProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 font-[family-name:var(--font-geist-sans)] text-gray-900">
      <main className="mx-auto flex w-full max-w-2xl flex-grow items-center px-6 py-16">
        <section className="w-full rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <svg
              aria-hidden="true"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Payments aren&apos;t configured
          </h1>
          <p className="mx-auto mt-3 max-w-md text-gray-600">
            Add your Stripe credentials in Reponse before accepting payments
            through this storefront.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={paymentsSettingsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Configure payments
            </a>
            <Link
              href="/cart"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Return to cart
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
