import { describe, expect, it } from "vitest";
import { extractEnvelopeData, getApiErrorMessage } from "./response";

describe("api response helpers", () => {
  it("unwraps data envelopes and keeps raw payloads untouched", () => {
    expect(extractEnvelopeData({ data: { id: "cart_1" } })).toEqual({ id: "cart_1" });
    expect(extractEnvelopeData({ id: "cart_1" })).toEqual({ id: "cart_1" });
  });

  it("normalizes flat and structured API errors", () => {
    expect(getApiErrorMessage({ error: "Invalid code" }, "Fallback")).toBe("Invalid code");
    expect(
      getApiErrorMessage(
        { error: { code: "bad_request", message: "Missing email", request_id: "req_1" } },
        "Fallback",
      ),
    ).toBe("Missing email");
    expect(getApiErrorMessage(null, "Fallback")).toBe("Fallback");
  });
});
