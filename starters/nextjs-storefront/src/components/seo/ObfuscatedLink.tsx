"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
  type KeyboardEvent,
} from "react";

interface ObfuscatedLinkProps {
  /** Target URL — will be Base64-encoded in the DOM to hide it from crawlers */
  to: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Accessible label for screen readers */
  ariaLabel?: string;
  /** Open in a new tab */
  external?: boolean;
}

/**
 * SEO-optimised link component that hides URLs from search engine crawlers.
 *
 * Use this for links that should NOT be crawled (cart, checkout, policies,
 * filters, account pages, etc.). For links that should be crawled by Google
 * (products, collections, homepage), use the standard Next.js `<Link>`.
 *
 * How it works:
 * - Renders a `<span>` instead of an `<a>` → no href for Googlebot to follow
 * - The target URL is Base64-encoded in a `data-` attribute → not pattern-matched
 * - Navigation is handled via `router.push()` on click
 * - Fully accessible: role="link", tabIndex, keyboard support, aria-label
 * - Supports middle-click / Ctrl+Click to open in a new tab
 */
export function ObfuscatedLink({
  to,
  children,
  className,
  style,
  ariaLabel,
  external = false,
}: ObfuscatedLinkProps) {
  const router = useRouter();

  const encoded =
    typeof window !== "undefined"
      ? btoa(to)
      : Buffer.from(to).toString("base64");

  const navigate = useCallback(
    (newTab: boolean) => {
      const decoded = atob(encoded);
      if (newTab || external) {
        window.open(decoded, "_blank", "noopener,noreferrer");
      } else {
        router.push(decoded);
      }
    },
    [encoded, external, router],
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      // Ctrl+Click or Cmd+Click → new tab
      const newTab = e.ctrlKey || e.metaKey;
      navigate(newTab);
    },
    [navigate],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      // Middle-click (button 1) → new tab
      if (e.button === 1) {
        e.preventDefault();
        navigate(true);
      }
    },
    [navigate],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navigate(false);
      }
    },
    [navigate],
  );

  return (
    <span
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      className={className}
      style={{ cursor: "pointer", ...style }}
      aria-label={ariaLabel}
      data-o={encoded}
    >
      {children}
    </span>
  );
}
