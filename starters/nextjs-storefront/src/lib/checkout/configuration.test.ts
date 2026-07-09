import { describe, expect, it } from "vitest";
import { resolveEmbeddedCheckoutConfiguration } from "./configuration";

describe("resolveEmbeddedCheckoutConfiguration", () => {
  it("returns the workspace payments page when the publishable key is missing", () => {
    expect(resolveEmbeddedCheckoutConfiguration("", "workspace-123")).toEqual({
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
      ),
    ).toEqual({
      status: "ready",
      stripePublishableKey: "pk_test_workspace",
    });
  });
});
