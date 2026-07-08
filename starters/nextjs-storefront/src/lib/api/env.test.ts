import { afterEach, describe, expect, it } from "vitest";
import { getStorefrontEnv } from "./env";

type RuntimeGlobal = typeof globalThis & {
  __ENV?: {
    REPONSE_API_URL?: string;
    REPONSE_WORKSPACE_ID?: string;
    LOCALE?: string;
  };
};

describe("getStorefrontEnv", () => {
  afterEach(() => {
    delete (globalThis as RuntimeGlobal).__ENV;
  });

  it("prefers runtime-injected client env", () => {
    (globalThis as RuntimeGlobal).__ENV = {
      REPONSE_API_URL: "https://runtime.example/api",
      REPONSE_WORKSPACE_ID: "ws_runtime",
      LOCALE: "fr",
    };

    expect(getStorefrontEnv()).toEqual({
      apiUrl: "https://runtime.example/api",
      workspaceId: "ws_runtime",
      locale: "fr",
    });
  });

  it("falls back to server defaults", () => {
    expect(getStorefrontEnv()).toMatchObject({
      apiUrl: "https://reponse.ai/api",
      workspaceId: "",
    });
  });
});
