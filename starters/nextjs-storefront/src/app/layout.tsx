import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Reponse Store", template: "%s | Reponse Store" },
  description: "The official Reponse demo store — headless commerce, powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Runtime env injection — allows client components to read server-only vars */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV=${JSON.stringify({
              REPONSE_API_URL: process.env.REPONSE_API_URL || "https://reponse.ai/api",
              REPONSE_WORKSPACE_ID: process.env.REPONSE_WORKSPACE_ID || "",
            })}`,
          }}
        />
        {children}
        <Footer storeName={process.env.STORE_NAME || "Store"} />
        {process.env.REPONSE_WORKSPACE_ID && (
          <Script
            src="https://reponse.ai/assets/sdk/reponse-widget.min.js"
            data-workspace-id={process.env.REPONSE_WORKSPACE_ID}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
