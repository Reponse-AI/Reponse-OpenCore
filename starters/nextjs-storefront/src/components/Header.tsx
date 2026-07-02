import Link from "next/link";
import { getCart } from "@/lib/cart";
import { HeaderNav } from "@/components/seo/HeaderNav";

export async function Header() {
  const cart = await getCart();
  const itemCount = cart?.items?.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <Link href="/" className="text-xl font-bold tracking-tight">
        Reponse Store
      </Link>
      <HeaderNav itemCount={itemCount} />
    </header>
  );
}
