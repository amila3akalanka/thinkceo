"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { btnGhost, btnPrimary, card } from "@/components/ui";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

type Message = { tone: "ok" | "error"; text: string };

const inputClass =
  "w-full rounded-2xl bg-violet-50 px-4 py-4 font-semibold outline-none ring-2 ring-transparent focus:ring-violet-400";

export default function LoginPage() {
  const router = useRouter();
  const { user, progress, signOut } = useProgress();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  // /auth/callback sends people here with ?error=link when a sign-in link can't be used.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("error")) {
      setMessage({
        tone: "error",
        text: "That sign-in link didn't work. It may have expired, been used already, or been opened in a different browser. Request a new email and enter the code instead.",
      });
    }
  }, []);

  const redirectTo = () => `${window.location.origin}/auth/callback`;

  async function sendEmail(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMessage(null);
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    setBusy(false);
    if (error) {
      setMessage({ tone: "error", text: error.message });
      return;
    }
    setStep("code");
    setMessage({
      tone: "ok",
      text: `Email sent to ${email}. Enter the code from the email, or tap the link in this same browser.`,
    });
  }

  async function verifyCode(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMessage(null);
    const { error } = await sb.auth.verifyOtp({ email, token: code.trim(), type: "email" });
    setBusy(false);
    if (error) {
      setMessage({ tone: "error", text: "That code didn't work. Check it, or send a new email." });
      return;
    }
    router.push("/path");
  }

  async function signInWithGoogle() {
    const { error } = (await getSupabase()?.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo() },
    })) ?? { error: null };
    if (error) setMessage({ tone: "error", text: error.message });
  }

  if (user) {
    return (
      <div className="flex min-h-dvh flex-col justify-center px-5 py-8">
        <div className={`${card} text-center`}>
          <IconBadge name="check" tone="green" size="lg" />
          <h1 className="mt-4 text-2xl font-extrabold">You&apos;re signed in</h1>
          <p className="mt-1 text-violet-900/60">{user.email}</p>
          <p className="mt-3 text-sm text-violet-900/60">
            This browser stays signed in, so you won&apos;t need to sign in again here unless you sign out.
          </p>
          <Link href={progress?.assessment ? "/path" : "/onboarding"} className={`${btnPrimary} mt-6`}>
            Continue <Icon name="arrowRight" />
          </Link>
          <button type="button" onClick={signOut} className={`${btnGhost} mt-3`}>
            <Icon name="logout" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-5 py-8">
      <div className="text-center">
        <IconBadge name="crown" tone="violet" size="lg" />
        <h1 className="mt-4 text-3xl font-extrabold">Sign in to ThinkCEO</h1>
        <p className="mt-2 text-violet-900/60">New or returning, use the same email. Your progress syncs across devices.</p>
      </div>

      <div className={`${card} mt-8`}>
        {!supabaseConfigured ? (
          <p className="text-sm text-violet-900/70">
            Accounts are not set up yet. Add your Supabase keys to <code>.env.local</code> to enable sign-in. You can
            still play as a guest; progress is saved on this device.
          </p>
        ) : step === "email" ? (
          <>
            <button type="button" onClick={signInWithGoogle} className={btnGhost}>
              <Icon name="login" /> Continue with Google
            </button>
            <div className="my-4 flex items-center gap-3 text-xs font-bold text-violet-300">
              <span className="h-px flex-1 bg-violet-100" /> OR <span className="h-px flex-1 bg-violet-100" />
            </div>
            <form onSubmit={sendEmail} className="space-y-3">
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
                className={inputClass}
              />
              <button type="submit" disabled={busy} className={btnPrimary}>
                {busy ? <Icon name="loader" className="h-5 w-5 animate-spin" /> : <Icon name="mail" />} Email me a
                sign-in code
              </button>
            </form>
          </>
        ) : (
          <form onSubmit={verifyCode} className="space-y-3">
            <input
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,10}"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Code from email"
              aria-label="Sign-in code"
              className={`${inputClass} text-center text-2xl tracking-[0.3em]`}
            />
            <button type="submit" disabled={busy} className={btnPrimary}>
              {busy ? <Icon name="loader" className="h-5 w-5 animate-spin" /> : <Icon name="check" />} Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setMessage(null);
              }}
              className={btnGhost}
            >
              Use a different email or resend
            </button>
          </form>
        )}

        {message && (
          <p className={`mt-3 text-sm font-semibold ${message.tone === "error" ? "text-orange-600" : "text-emerald-600"}`}>
            {message.text}
          </p>
        )}
      </div>

      <Link href="/" className="mt-6 text-center font-bold text-violet-600">
        Continue as guest
      </Link>
    </div>
  );
}
