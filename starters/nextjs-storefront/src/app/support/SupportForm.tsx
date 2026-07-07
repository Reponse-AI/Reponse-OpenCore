"use client";

import { useState, FormEvent } from "react";
import { createTicket } from "@/lib/tickets";

const CATEGORIES = [
  { value: "", label: "Select a category" },
  { value: "order", label: "Order Issue" },
  { value: "shipping", label: "Shipping & Delivery" },
  { value: "product", label: "Product Question" },
  { value: "return", label: "Returns & Refunds" },
  { value: "account", label: "Account & Login" },
  { value: "other", label: "Other" },
];

export function SupportForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    ticketId?: string;
    error?: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await createTicket({
        customer_email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        ...(category ? { category } : {}),
      });

      if (res.success) {
        setResult({ success: true, ticketId: res.id });
        setSubject("");
        setCategory("");
        setMessage("");
      } else {
        setResult({ success: false, error: res.error });
      }
    } catch {
      setResult({ success: false, error: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "var(--rp-radius)",
    border: "1px solid var(--rp-color-border)",
    backgroundColor: "var(--rp-color-surface)",
    color: "var(--rp-color-text)",
    fontFamily: "var(--rp-font-family)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box" as const,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--rp-color-text)",
    marginBottom: "6px",
  };

  // Success state
  if (result?.success) {
    return (
      <div
        style={{
          padding: "40px 32px",
          borderRadius: "var(--rp-radius)",
          backgroundColor: "var(--rp-color-surface)",
          border: "1px solid var(--rp-color-border)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            margin: "0 0 8px 0",
            color: "var(--rp-color-text)",
          }}
        >
          Ticket Created
        </h2>
        <p
          style={{
            fontSize: "15px",
            color: "var(--rp-color-text-secondary)",
            margin: "0 0 8px 0",
            lineHeight: 1.5,
          }}
        >
          We&apos;ve received your request and will get back to you as soon as
          possible.
        </p>
        {result.ticketId && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--rp-color-text-secondary)",
              margin: "0 0 24px 0",
            }}
          >
            Ticket ID:{" "}
            <strong style={{ color: "var(--rp-color-text)" }}>
              {result.ticketId}
            </strong>
          </p>
        )}
        <button
          type="button"
          onClick={() => setResult(null)}
          style={{
            padding: "12px 28px",
            borderRadius: "var(--rp-radius)",
            backgroundColor: "var(--rp-color-primary)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "var(--rp-font-family)",
            border: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "28px",
        borderRadius: "var(--rp-radius)",
        backgroundColor: "var(--rp-color-surface)",
        border: "1px solid var(--rp-color-border)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Email */}
      <div>
        <label htmlFor="support-email" style={labelStyle}>
          Email Address
        </label>
        <input
          id="support-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--rp-color-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--rp-color-border)";
          }}
        />
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="support-subject" style={labelStyle}>
          Subject
        </label>
        <input
          id="support-subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief summary of your issue"
          style={inputStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--rp-color-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--rp-color-border)";
          }}
        />
      </div>

      {/* Category */}
      <div>
        <label htmlFor="support-category" style={labelStyle}>
          Category
        </label>
        <select
          id="support-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            ...inputStyle,
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
            paddingRight: "36px",
          }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="support-message" style={labelStyle}>
          Message
        </label>
        <textarea
          id="support-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your issue in detail…"
          rows={6}
          style={{
            ...inputStyle,
            resize: "vertical",
            lineHeight: 1.5,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--rp-color-primary)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--rp-color-border)";
          }}
        />
      </div>

      {/* Error */}
      {result?.error && (
        <p
          role="alert"
          style={{
            margin: 0,
            fontSize: "14px",
            color: "var(--rp-color-error)",
            padding: "12px 16px",
            borderRadius: "var(--rp-radius)",
            backgroundColor:
              "color-mix(in srgb, var(--rp-color-error) 8%, transparent)",
            border:
              "1px solid color-mix(in srgb, var(--rp-color-error) 25%, transparent)",
          }}
        >
          {result.error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !email.trim() || !subject.trim() || !message.trim()}
        style={{
          padding: "14px 28px",
          borderRadius: "var(--rp-radius)",
          backgroundColor: "var(--rp-color-primary)",
          color: "#ffffff",
          fontSize: "15px",
          fontWeight: 600,
          fontFamily: "var(--rp-font-family)",
          border: "none",
          cursor:
            isSubmitting || !email.trim() || !subject.trim() || !message.trim()
              ? "not-allowed"
              : "pointer",
          opacity:
            isSubmitting || !email.trim() || !subject.trim() || !message.trim()
              ? 0.5
              : 1,
          transition: "opacity 0.2s",
        }}
      >
        {isSubmitting ? "Submitting…" : "Submit Request"}
      </button>
    </form>
  );
}
