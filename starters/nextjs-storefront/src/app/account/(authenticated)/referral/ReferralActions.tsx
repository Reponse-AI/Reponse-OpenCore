"use client";

import { useState } from "react";

interface ReferralActionsProps {
  code: string;
  url: string;
}

export function ReferralActions({ code, url }: ReferralActionsProps) {
  const [copiedField, setCopiedField] = useState<"code" | "url" | null>(null);

  const handleCopy = async (value: string, field: "code" | "url") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "var(--rp-radius)",
    border: "1px solid var(--rp-color-border)",
    backgroundColor: "var(--rp-color-background)",
    color: "var(--rp-color-text)",
    fontFamily: "var(--rp-font-family)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    padding: "12px 18px",
    borderRadius: "var(--rp-radius)",
    border: "1px solid var(--rp-color-border)",
    backgroundColor: "var(--rp-color-surface)",
    color: "var(--rp-color-text)",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "var(--rp-font-family)",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
  };

  const copiedStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "var(--rp-color-success)",
    color: "#ffffff",
    borderColor: "var(--rp-color-success)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Code field */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          readOnly
          value={code}
          style={{
            ...inputStyle,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        />
        <button
          type="button"
          onClick={() => handleCopy(code, "code")}
          style={copiedField === "code" ? copiedStyle : buttonStyle}
        >
          {copiedField === "code" ? "✓ Copied" : "Copy Code"}
        </button>
      </div>

      {/* Shareable URL */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--rp-color-text-secondary)",
            marginBottom: "6px",
          }}
        >
          Shareable Link
        </label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            readOnly
            value={url}
            style={inputStyle}
          />
          <button
            type="button"
            onClick={() => handleCopy(url, "url")}
            style={copiedField === "url" ? copiedStyle : buttonStyle}
          >
            {copiedField === "url" ? "✓ Copied" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
