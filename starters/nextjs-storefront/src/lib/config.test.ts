import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("getStoreConfig", () => {
  it("defaults a missing Stripe publishable key to an empty string", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ modules: {} }), { status: 200 }),
      ),
    );

    const { getStoreConfig } = await import("@/lib/config");

    await expect(getStoreConfig()).resolves.toMatchObject({
      stripe_publishable_key: "",
    });
  });
});
