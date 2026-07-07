"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { replyToTicket } from "@/lib/tickets";

interface TicketReplyFormProps {
  ticketId: string;
}

export function TicketReplyForm({ ticketId }: TicketReplyFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await replyToTicket(ticketId, message.trim());
      if (result.success) {
        setMessage("");
        router.refresh();
      } else {
        setError(result.error || "Failed to send reply");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "24px",
        borderRadius: "var(--rp-radius)",
        backgroundColor: "var(--rp-color-surface)",
        border: "1px solid var(--rp-color-border)",
        fontFamily: "var(--rp-font-family)",
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          margin: "0 0 12px 0",
          color: "var(--rp-color-text)",
        }}
      >
        Reply
      </h3>
      <textarea
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          setError(null);
        }}
        placeholder="Type your reply…"
        rows={4}
        required
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: "var(--rp-radius)",
          border: "1px solid var(--rp-color-border)",
          backgroundColor: "var(--rp-color-background)",
          color: "var(--rp-color-text)",
          fontFamily: "var(--rp-font-family)",
          fontSize: "14px",
          lineHeight: 1.5,
          outline: "none",
          resize: "vertical",
          transition: "border-color 0.2s",
          boxSizing: "border-box",
          marginBottom: "12px",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--rp-color-primary)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--rp-color-border)";
        }}
      />

      {error && (
        <p
          role="alert"
          style={{
            margin: "0 0 12px 0",
            fontSize: "13px",
            color: "var(--rp-color-error)",
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !message.trim()}
        style={{
          padding: "12px 24px",
          borderRadius: "var(--rp-radius)",
          backgroundColor: "var(--rp-color-primary)",
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: 600,
          fontFamily: "var(--rp-font-family)",
          border: "none",
          cursor:
            isSubmitting || !message.trim() ? "not-allowed" : "pointer",
          opacity: isSubmitting || !message.trim() ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {isSubmitting ? "Sending…" : "Send Reply"}
      </button>
    </form>
  );
}
