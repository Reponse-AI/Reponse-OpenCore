import { redirect } from "next/navigation";
import Link from "next/link";
import { getContactId, getAuthenticatedContact } from "@/lib/auth";
import { getTickets } from "@/lib/tickets";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata = {
  title: "My Support Tickets",
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

export default async function AccountSupportPage() {
  const contactId = await getContactId();
  if (!contactId) {
    redirect("/account/login");
  }

  const contact = await getAuthenticatedContact();
  if (!contact?.email) {
    redirect("/account/login");
  }

  const tickets = await getTickets(contact.email);

  const cardStyle: React.CSSProperties = {
    padding: "24px",
    borderRadius: "var(--rp-radius)",
    backgroundColor: "var(--rp-color-surface)",
    border: "1px solid var(--rp-color-border)",
    fontFamily: "var(--rp-font-family)",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          }}
        >
          Support Tickets
        </h1>
        <Link
          href="/support"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "10px 20px",
            borderRadius: "var(--rp-radius)",
            backgroundColor: "var(--rp-color-primary)",
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            transition: "opacity 0.2s",
          }}
        >
          + New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.4 }}>
            💬
          </div>
          <p
            style={{
              fontSize: "15px",
              color: "var(--rp-color-text-secondary)",
              margin: "0 0 4px 0",
            }}
          >
            No support tickets yet
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--rp-color-text-secondary)",
              margin: 0,
            }}
          >
            Need help?{" "}
            <Link
              href="/support"
              style={{
                color: "var(--rp-color-primary)",
                textDecoration: "underline",
              }}
            >
              Create a ticket
            </Link>
          </p>
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {tickets.map((ticket) => {
            const colors = statusColor(ticket.status);
            const lastNote = ticket.notes?.[ticket.notes.length - 1];
            return (
              <Link
                key={ticket.id}
                href={`/account/support/${ticket.id}`}
                style={{
                  ...cardStyle,
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  transition: "box-shadow 0.2s, border-color 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      margin: 0,
                      color: "var(--rp-color-text)",
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ticket.subject}
                  </h3>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      backgroundColor: colors.bg,
                      color: colors.text,
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "capitalize",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "var(--rp-color-text-secondary)",
                  }}
                >
                  <span>
                    {ticket.category && (
                      <>
                        <span style={{ textTransform: "capitalize" }}>
                          {ticket.category}
                        </span>{" "}
                        ·{" "}
                      </>
                    )}
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                  {lastNote && (
                    <span>
                      Last reply:{" "}
                      {new Date(lastNote.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
