import { Reponse } from "@reponseai/sdk";

// Initialize the Reponse SDK
export const reponse = new Reponse({
  apiKey: process.env.REPONSE_API_KEY || "dummy_key_for_dev",
  baseUrl: process.env.REPONSE_API_URL || "http://localhost:3000/api",
});
