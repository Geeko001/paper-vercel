"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const FRIENDLY_ERRORS: Record<string, string> = {
  oauth: "This sign-in link is invalid or expired. Please try again.",
  "Invalid login credentials": "Incorrect email or password.",
  "Email not confirmed":
    "Please confirm your email first — check your inbox for the link.",
  "User already registered":
    "An account with this email already exists. Try signing in instead.",
};

export function SignInForm({ linkError }: { linkError: boolean }) {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    linkError ? FRIENDLY_ERRORS.oauth : null,
  );

  function friendly(message: string): string {
    return FRIENDLY_ERRORS[message] ?? "Something went wrong. Please try again.";
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();

    if (mode === "sign-in") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(friendly(error.message));
        setBusy(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        },
      });
      if (error) {
        setError(friendly(error.message));
        setBusy(false);
        return;
      }
      // No session means email confirmation is required before first sign-in.
      if (!data.session) {
        setNotice(
          "Account created. Check your inbox for the confirmation link, then sign in.",
        );
        setMode("sign-in");
        setBusy(false);
        return;
      }
      router.push("/account");
      router.refresh();
    }
  }

  return (
    <div className="mt-6">
      {error && (
        <p role="alert" className="mb-4 rounded-[8px] border border-red-300/60 bg-red-50 px-3.5 py-2.5 text-left text-[13px] text-red-900">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mb-4 rounded-[8px] border rule bg-background px-3.5 py-2.5 text-left text-[13px]">
          {notice}
        </p>
      )}

      <form onSubmit={submit} className="space-y-3 text-left">
        <label className="block text-[13px]">
          Email address
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1.5 w-full rounded-[8px] border rule bg-background px-3.5 py-2.5 text-[14px] outline-none placeholder:text-foreground-muted/70"
          />
        </label>
        <label className="block text-[13px]">
          Password
          <input
            type="password"
            required
            minLength={6}
            autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={
              mode === "sign-in" ? "Enter your password" : "Min. 6 characters"
            }
            className="mt-1.5 w-full rounded-[8px] border rule bg-background px-3.5 py-2.5 text-[14px] outline-none placeholder:text-foreground-muted/70"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-[8px] bg-inverse px-4 py-2.5 text-[14px] font-medium text-inverse-foreground transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        >
          {busy
            ? "Please wait…"
            : mode === "sign-in"
              ? "Sign In"
              : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-[13px] text-foreground-muted">
        {mode === "sign-in" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("sign-up");
                setError(null);
                setNotice(null);
              }}
              className="text-foreground underline underline-offset-4"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("sign-in");
                setError(null);
                setNotice(null);
              }}
              className="text-foreground underline underline-offset-4"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}
