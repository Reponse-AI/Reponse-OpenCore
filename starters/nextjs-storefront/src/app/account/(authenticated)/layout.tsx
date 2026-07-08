import { redirect } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { AccountNav } from "@/components/AccountNav";
import { getSessionToken } from "@/lib/auth";
import { getStoreConfig, isModuleActive } from "@/lib/config";
import { getLoyaltyProgram } from "@/lib/loyalty";

// ─── Static nav items ────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const CORE_NAV_ITEMS: NavItem[] = [
  {
    label: "Profile",
    href: "/account",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <line x1="3" x2="21" y1="6" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
];

// ─── Module-gated nav items ───────────────────────────────────────────────────

const REWARDS_NAV: NavItem = {
  label: "Rewards",
  href: "/account/rewards",
  icon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
};

const REFERRAL_NAV: NavItem = {
  label: "Referral",
  href: "/account/referral",
  icon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  ),
};

const SUPPORT_NAV: NavItem = {
  label: "Support",
  href: "/account/support",
  icon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
};

const GIFT_CARDS_NAV: NavItem = {
  label: "Gift Cards",
  href: "/account/gift-cards",
  icon: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M12 8V2" />
      <path d="m8 2 4 6 4-6" />
      <line x1="3" x2="21" y1="14" y2="14" />
    </svg>
  ),
};

// ─── Layout ───────────────────────────────────────────────────────────────────

export default async function AccountAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getSessionToken();

  if (!token) {
    redirect("/account/login");
  }

  // Build dynamic nav based on active modules
  const config = await getStoreConfig();
  const navItems: NavItem[] = [...CORE_NAV_ITEMS];

  const loyaltyActive = isModuleActive(config, "loyalty");
  if (loyaltyActive) {
    navItems.push(REWARDS_NAV);

    // Only show referral if the program has it enabled
    const program = await getLoyaltyProgram();
    if (program?.referral_enabled) {
      navItems.push(REFERRAL_NAV);
    }
  }

  if (isModuleActive(config, "support")) {
    navItems.push(SUPPORT_NAV);
  }

  if (isModuleActive(config, "gift_cards")) {
    navItems.push(GIFT_CARDS_NAV);
  }

  // Always show support — it's a core feature even without module flag
  if (!navItems.some((item) => item.href === "/account/support")) {
    navItems.push(SUPPORT_NAV);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-[family-name:var(--font-geist-sans)] flex flex-col">
      <Header />

      <div className="flex-grow max-w-6xl w-full mx-auto px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">My Account</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
              <AccountNav items={navItems} />
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

