"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { demoLogin, setSession } from "@/lib/auth";
import { getApiOrigin, getStorefrontEnv } from "@/lib/api/env";
import { readJsonResult } from "@/lib/api/response";
import type { OtpVerifyResponse } from "@/types/storefront";

export function useOtpLogin() {
  const router = useRouter();

  const requestCode = useMutation({
    mutationFn: async (email: string) => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const response = await fetch(`${getApiOrigin(apiUrl)}/api/auth/b2c/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, email }),
      });
      return readJsonResult<{ success?: boolean }>(response, "Failed to send verification code");
    },
  });

  const verifyCode = useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const { apiUrl, workspaceId } = getStorefrontEnv();
      const response = await fetch(`${getApiOrigin(apiUrl)}/api/auth/b2c/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, email, code }),
      });
      const data = await readJsonResult<OtpVerifyResponse>(response, "Invalid code. Please try again.");

      if (!data.success) throw new Error(data.error || "Invalid code. Please try again.");
      if (data.sessionToken && data.contactId) {
        await setSession(data.sessionToken, data.contactId);
        router.push("/account");
        router.refresh();
      }
      return data;
    },
  });

  const loginDemo = useMutation({
    mutationFn: async () => {
      const result = await demoLogin();
      if (!result.ok) throw new Error(result.error || "Demo account unavailable");
      router.push("/account");
      router.refresh();
      return result;
    },
  });

  return { requestCode, verifyCode, loginDemo };
}
