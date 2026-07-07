import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { TrackOrderForm } from "@/components/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Enter your email and order number to track your order status.",
};

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />

      <main className="flex-grow max-w-2xl w-full mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">Track Your Order</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          Track Your Order
        </h1>
        <p className="text-gray-500 mb-8">
          Enter your email and order number to see your order status.
        </p>

        <TrackOrderForm />
      </main>
    </div>
  );
}
