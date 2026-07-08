import { Header } from "@/components/Header";
import { clearBuyNowCartId, clearCartId } from "@/lib/cart";
import { parseCheckoutMode } from "@/lib/checkout/mode";
import Link from "next/link";

export const metadata = {
  title: "Order Success | Reponse Store",
};

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: rawMode } = await searchParams;
  const mode = parseCheckoutMode(rawMode);
  if (mode === "buy-now") {
    await clearBuyNowCartId();
  } else {
    await clearCartId();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />
      <main className="flex-grow max-w-2xl w-full mx-auto px-8 py-32 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Thank you for your order!</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          Your payment was successful and your order is now being processed. We&apos;ll send you a confirmation email shortly.
        </p>
        
        <Link href="/products" className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors">
          Continue Shopping
        </Link>
      </main>
    </div>
  );
}
