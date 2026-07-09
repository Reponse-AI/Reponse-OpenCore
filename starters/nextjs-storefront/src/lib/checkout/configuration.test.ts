import { describe, expect, it } from "vitest";
import { resolveEmbeddedCheckoutConfiguration } from "./configuration";

describe("resolveEmbeddedCheckoutConfiguration", () => {
  it("stays hidden before the payment step when the key is missing", () => {
    expect(
      resolveEmbeddedCheckoutConfiguration(
        "",
        "workspace-123",
        "shipping",
      ),
    ).toEqual({
      status: "hidden",
    });
  });

  it("returns the workspace payments page when the publishable key is missing", () => {
    expect(
      resolveEmbeddedCheckoutConfiguration("", "workspace-123", "payment"),
    ).toEqual({
      status: "missing",
      paymentsSettingsUrl:
        "https://reponse.ai/en/dashboard/workspace-123/settings/payments",
    });
  });

  it("returns the normalized publishable key when checkout is configured", () => {
    expect(
      resolveEmbeddedCheckoutConfiguration(
        "  pk_test_workspace  ",
        "workspace-123",
        "payment",
      ),
    ).toEqual({
      status: "ready",
      stripePublishableKey: "pk_test_workspace",
    });
  });
});
