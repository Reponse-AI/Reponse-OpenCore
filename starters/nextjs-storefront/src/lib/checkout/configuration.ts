type EmbeddedCheckoutConfiguration =
  | {
      status: "hidden";
    }
  | {
      status: "ready";
      stripePublishableKey: string;
    }
  | {
      status: "missing";
      paymentsSettingsUrl: string;
    };

export function resolveEmbeddedCheckoutConfiguration(
  stripePublishableKey: string,
  workspaceId: string,
  step: "contact" | "shipping" | "payment",
): EmbeddedCheckoutConfiguration {
  if (step !== "payment") {
    return { status: "hidden" };
  }

  const normalizedKey = stripePublishableKey.trim();

  if (normalizedKey) {
    return {
      status: "ready",
      stripePublishableKey: normalizedKey,
    };
  }

  return {
    status: "missing",
    paymentsSettingsUrl: `https://reponse.ai/en/dashboard/${encodeURIComponent(workspaceId)}/settings/payments`,
  };
}
