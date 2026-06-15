import Link from "next/link";

const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/policies/privacy-policy" },
  { label: "Terms of Service", href: "/policies/terms-of-service" },
  { label: "Refund Policy", href: "/policies/refund-policy" },
  { label: "Shipping Policy", href: "/policies/shipping-policy" },
  { label: "Legal Notice", href: "/policies/legal-notice" },
];

export function Footer() {
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Store";
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        padding: "32px 24px",
        marginTop: 64,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
        }}
      >
        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {POLICY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13,
                color: "#6b7280",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p
          style={{
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          © {year} {storeName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
