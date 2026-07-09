type EmbeddedCheckoutConfiguration =
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
): EmbeddedCheckoutConfiguration {
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
