import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getContactId } from "@/lib/auth";
import { getTicket } from "@/lib/tickets";
import { TicketReplyForm } from "./TicketReplyForm";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Ticket Detail",
};

// ─── Status badge helper ──────────────────────────────────────────────────────

function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "open":
      return {
        bg: "color-mix(in srgb, var(--rp-color-primary) 10%, transparent)",
        text: "var(--rp-color-primary)",
      };
    case "pending":
      return {
        bg: "color-mix(in srgb, #f59e0b 10%, transparent)",
        text: "#d97706",
      };
    case "resolved":
      return {
        bg: "color-mix(in srgb, var(--rp-color-success) 10%, transparent)",
        text: "var(--rp-color-success)",
      };
    case "closed":
      return {
        bg: "color-mix(in srgb, var(--rp-color-text-secondary) 10%, transparent)",
        text: "var(--rp-color-text-secondary)",
      };
    default:
      return {
        bg: "var(--rp-color-background)",
        text: "var(--rp-color-text-secondary)",
      };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface TicketDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const contactId = await getContactId();
  if (!contactId) {
    redirect("/account/login");
  }

  const { id } = await params;
  const ticket = await getTicket(id);
  if (!ticket) {
    notFound();
  }

  const colors = statusColor(ticket.status);
  const isOpen = ticket.status === "open" || ticket.status === "pending";

  const cardStyle: React.CSSProperties = {
    padding: "24px",
    borderRadius: "var(--rp-radius)",
    backgroundColor: "var(--rp-color-surface)",
    border: "1px solid var(--rp-color-border)",
    fontFamily: "var(--rp-font-family)",
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/account/support"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "14px",
          color: "var(--rp-color-text-secondary)",
          textDecoration: "none",
          marginBottom: "20px",
          fontFamily: "var(--rp-font-family)",
          transition: "color 0.2s",
        }}
      >
        ← Back to tickets
      </Link>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            margin: 0,
            fontFamily: "var(--rp-font-family)",
            color: "var(--rp-color-text)",
            flex: 1,
          }}
        >
          {ticket.subject}
        </h1>
        <span
          style={{
            display: "inline-flex",
            padding: "4px 12px",
            borderRadius: "9999px",
            backgroundColor: colors.bg,
            color: colors.text,
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {ticket.status}
        </span>
      </div>

      {/* Ticket meta */}
      <div
        style={{
          ...cardStyle,
          marginBottom: "24px",
          display: "flex",
          gap: "24px",
          flexWrap: "wrap",
          fontSize: "14px",
        }}
      >
        <div>
          <span style={{ color: "var(--rp-color-text-secondary)" }}>
            Created:{" "}
          </span>
          <span style={{ fontWeight: 500 }}>
            {new Date(ticket.created_at).toLocaleString()}
          </span>
        </div>
        {ticket.category && (
          <div>
            <span style={{ color: "var(--rp-color-text-secondary)" }}>
              Category:{" "}
            </span>
            <span
              style={{ fontWeight: 500, textTransform: "capitalize" }}
            >
              {ticket.category}
            </span>
          </div>
        )}
        {ticket.order_id && (
          <div>
            <span style={{ color: "var(--rp-color-text-secondary)" }}>
              Order:{" "}
            </span>
            <span style={{ fontWeight: 500 }}>{ticket.order_id}</span>
          </div>
        )}
      </div>

      {/* Conversation thread */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        {ticket.notes.length === 0 ? (
          <div
            style={{
              ...cardStyle,
              textAlign: "center",
              padding: "32px",
              color: "var(--rp-color-text-secondary)",
              fontSize: "14px",
            }}
          >
            No messages yet.
          </div>
        ) : (
          ticket.notes.map((note) => {
            const isCustomer = note.author_type === "customer";
            return (
              <div
                key={note.id}
                style={{
                  ...cardStyle,
                  borderLeft: `3px solid ${isCustomer ? "var(--rp-color-primary)" : "var(--rp-color-success)"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: isCustomer
                          ? "color-mix(in srgb, var(--rp-color-primary) 15%, transparent)"
                          : "color-mix(in srgb, var(--rp-color-success) 15%, transparent)",
                        color: isCustomer
                          ? "var(--rp-color-primary)"
                          : "var(--rp-color-success)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: 700,
                      }}
                    >
                      {isCustomer ? "Y" : "S"}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--rp-color-text)",
                      }}
                    >
                      {isCustomer
                        ? "You"
                        : note.author_name || "Support Agent"}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--rp-color-text-secondary)",
                    }}
                  >
                    {new Date(note.created_at).toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.6,
                    color: "var(--rp-color-text)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {note.body}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply form */}
      {isOpen && <TicketReplyForm ticketId={ticket.id} />}
    </div>
  );
}
