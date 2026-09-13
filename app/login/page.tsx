"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon, IconBadge } from "@/components/Icon";
import { btnGhost, btnPrimary, card } from "@/components/ui";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const redirectTo = () => `${window.location.origin}/auth/callback`;

  async function sendMagicLink(e: FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setStatus("sending");
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo() } });
    setStatus(error ? "error" : "sent");
    setMessage(error ? error.message : `Check ${email} for your sign-in link.`);
  }

  async function signInWithGoogle() {
    const { error } = (await getSupabase()?.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo() },
    })) ?? { error: null };
    if (error) {
      setStatus("error");
      setMessage(error.message);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center px-5 py-8">
      <div className="text-center">
        <IconBadge name="crown" tone="violet" size="lg" />
        <h1 className="mt-4 text-3xl font-extrabold">Save your progress</h1>
        <p className="mt-2 text-violet-900/60">Sync your path, XP and streak across devices.</p>
      </div>

      <div className={`${card} mt-8`}>
        {supabaseConfigured ? (
          <>
            <button type="button" onClick={signInWithGoogle} className={btnGhost}>
              <Icon name="login" /> Continue with Google
            </button>
            <div className="my-4 flex items-center gap-3 text-xs font-bold text-violet-300">
              <span className="h-px flex-1 bg-violet-100" /> OR <span className="h-px flex-1 bg-violet-100" />
            </div>
            <form onSubmit={sendMagicLink} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-2xl bg-violet-50 px-4 py-4 font-semibold outline-none ring-2 ring-transparent focus:ring-violet-400"
              />
              <button type="submit" disabled={status === "sending"} className={btnPrimary}>
                <Icon name="mail" /> Email me a sign-in link
              </button>
            </form>
            {message && (
              <p className={`mt-3 text-sm font-semibold ${status === "error" ? "text-orange-600" : "text-emerald-600"}`}>
                {message}
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-violet-900/70">
            Accounts are not set up yet. Add your Supabase keys to <code>.env.local</code> to enable sign-in. You can
            still play as a guest; progress is saved on this device.
          </p>
        )}
      </div>

      <Link href="/" className="mt-6 text-center font-bold text-violet-600">
        Continue as guest
      </Link>
    </div>
  );
}
