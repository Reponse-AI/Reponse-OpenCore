import Link from "next/link";
import { getCart } from "@/lib/cart";

export async function Header() {
  const cart = await getCart();
  const itemCount = cart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Reponse Storefront
      </Link>
      <nav className="flex gap-6">
        <Link href="/products" className="text-sm font-medium hover:text-black/70 transition-colors">
          Catalog
        </Link>
        <Link href="/cart" className="text-sm font-medium hover:text-black/70 transition-colors flex items-center gap-2">
          Cart
          {itemCount > 0 && (
            <span className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  );
}
