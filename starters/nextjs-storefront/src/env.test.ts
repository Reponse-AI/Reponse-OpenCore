import { describe, expect, it } from "vitest";
import { env } from "./env";

describe("env", () => {
  it("provides typed defaults for optional storefront configuration", () => {
    expect(env.REPONSE_API_URL).toBe("https://reponse.ai/api");
    expect(env.REPONSE_WORKSPACE_ID).toBe("");
    expect(env.CHECKOUT_MODE).toBe("embedded");
  });
});
