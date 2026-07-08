"use client";

import { LoaderCircle } from "lucide-react";
import { useState, useCallback, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useOtpLogin } from "@/hooks/useOtpLogin";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginForm({ demoEnabled }: { demoEnabled: boolean }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { requestCode, verifyCode, loginDemo } = useOtpLogin();
  const loading = requestCode.isPending || verifyCode.isPending || loginDemo.isPending;

  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Auto-focus first code input when switching to code step
  useEffect(() => {
    if (step === "code") {
      codeInputsRef.current[0]?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleDemoLogin = useCallback(async () => {
    setError(null);
    try {
      await loginDemo.mutateAsync();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo account unavailable");
    }
  }, [loginDemo]);

  const handleEmailSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      try {
        await requestCode.mutateAsync(email);
        setStep("code");
        setResendCooldown(60);
        setResendSuccess(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    },
    [email, requestCode],
  );

  const handleResendCode = useCallback(async () => {
    setResendSuccess(false);
    setError(null);
    try {
      await requestCode.mutateAsync(email);
      setResendSuccess(true);
      setResendCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }, [email, requestCode]);

  const handleCodeChange = useCallback(
    (index: number, value: string) => {
      if (value.length > 1) {
        // Handle paste — split digits across inputs
        const digits = value.replace(/\D/g, "").split("").slice(0, 6);
        const newCode = [...code];
        digits.forEach((d, i) => {
          if (index + i < 6) newCode[index + i] = d;
        });
        setCode(newCode);
        const nextIdx = Math.min(index + digits.length, 5);
        codeInputsRef.current[nextIdx]?.focus();
        return;
      }

      const digit = value.replace(/\D/g, "");
      const newCode = [...code];
      newCode[index] = digit;
      setCode(newCode);

      if (digit && index < 5) {
        codeInputsRef.current[index + 1]?.focus();
      }
    },
    [code]
  );

  const handleCodeKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !code[index] && index > 0) {
        codeInputsRef.current[index - 1]?.focus();
      }
    },
    [code]
  );

  const handleCodeSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      const fullCode = code.join("");
      if (fullCode.length !== 6) {
        setError("Please enter the full 6-digit code");
        return;
      }

      try {
        await verifyCode.mutateAsync({ email, code: fullCode });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      }
    },
    [email, code, verifyCode],
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-[family-name:var(--font-geist-sans)]">
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Logo / back */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to store
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {step === "email" ? "Sign in" : "Enter code"}
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              {step === "email"
                ? "We'll send you a verification code to your email."
                : `We sent a 6-digit code to ${email}`}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-4 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-11 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>

                {demoEnabled && (
                  <>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 uppercase tracking-wide">or</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      disabled={loading}
                      className="w-full h-11 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Explore the demo account
                    </button>
                    <p className="text-xs text-center text-gray-400">
                      Instant access with sample orders, rewards and tickets — no email needed.
                    </p>
                  </>
                )}
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                {/* 6-digit code input */}
                <div className="flex justify-center gap-2">
                  {code.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeInputsRef.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleCodeChange(i, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(i, e)}
                      className="w-12 h-14 text-center text-xl font-semibold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      aria-label={`Digit ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || code.join("").length !== 6}
                  className="w-full h-11 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                      Verifying…
                    </>
                  ) : (
                    "Verify"
                  )}
                </button>

              {/* Resend code */}
              <div className="text-center space-y-1">
                {resendSuccess && (
                  <p className="text-sm text-emerald-600 font-medium">Code resent!</p>
                )}
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={handleResendCode}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive a code? Resend"}
                </button>
              </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setCode(["", "", "", "", "", ""]);
                      setError(null);
                    }}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Use a different email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
