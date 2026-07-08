import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    REPONSE_API_URL: z.string().url().default("https://reponse.ai/api"),
    REPONSE_WORKSPACE_ID: z.string().default(""),
    REPONSE_API_KEY: z.string().default(""),
    MARKET_ID: z.string().default(""),
    MARKET_CURRENCY: z.string().default("EUR"),
    CHECKOUT_MODE: z.enum(["embedded", "redirect"]).default("embedded"),
    STRIPE_PUBLISHABLE_KEY: z.string().default(""),
    SITE_URL: z.string().url().default("http://localhost:3000"),
    STORE_NAME: z.string().default("Store"),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    REPONSE_API_URL: process.env.REPONSE_API_URL,
    REPONSE_WORKSPACE_ID: process.env.REPONSE_WORKSPACE_ID,
    REPONSE_API_KEY: process.env.REPONSE_API_KEY,
    MARKET_ID: process.env.MARKET_ID,
    MARKET_CURRENCY: process.env.MARKET_CURRENCY,
    CHECKOUT_MODE: process.env.CHECKOUT_MODE,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    SITE_URL: process.env.SITE_URL,
    STORE_NAME: process.env.STORE_NAME,
  },
  emptyStringAsUndefined: true,
  skipValidation: Boolean(process.env.SKIP_ENV_VALIDATION),
});
