"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { btnGhost, btnPrimary, card } from "@/components/ui";
import { supabaseConfigured } from "@/lib/supabase";

const FEATURES = [
  { icon: "brain", tone: "soft", title: "Find your leader profile", text: "A 3-minute check on money, business sense and style." },
  { icon: "map", tone: "softOrange", title: "Get a path built for you", text: "Your weakest areas come first." },
  { icon: "target", tone: "soft", title: "Decide on real cases", text: "Netflix, LEGO, Intel, Tylenol and more." },
] as const;

const FLOATING = ["film", "cpu", "coffee", "blocks", "plane", "pizza"];

export default function Home() {
  const { progress, user } = useProgress();
  const started = Boolean(progress?.assessment);

  return (
    <div className="flex min-h-dvh flex-col px-5 py-8">
      <div className="relative mx-auto mt-4 mb-6 grid h-44 w-full place-items-center">
        {FLOATING.map((name, i) => {
          const angle = (i / FLOATING.length) * Math.PI * 2;
          // Round so server and client render identical style strings (avoids hydration mismatch).
          const x = Math.round(Math.cos(angle) * 120) - 18;
          const y = Math.round(Math.sin(angle) * 62) - 18;
          return (
            <motion.span
              key={name}
              className="absolute"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
            >
              <IconBadge name={name} tone={i % 2 ? "softOrange" : "soft"} size="sm" />
            </motion.span>
          );
        })}
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <IconBadge name="crown" tone="violet" size="lg" />
        </motion.div>
      </div>

      <h1 className="text-center text-4xl font-extrabold tracking-tight">
        Think like a <span className="text-orange-500">CEO</span>.
      </h1>
      <p className="mt-3 text-center text-violet-900/70">
        Real business dilemmas. Two-minute decisions. See what actually happened.
      </p>

      <div className="mt-8 space-y-3">
        {FEATURES.map((f) => (
          <div key={f.title} className={`${card} flex items-center gap-4 p-4`}>
            <IconBadge name={f.icon} tone={f.tone} />
            <div>
              <p className="font-bold">{f.title}</p>
              <p className="text-sm text-violet-900/60">{f.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto space-y-3 pt-8">
        {progress && (
          <Link href={started ? "/path" : "/onboarding"} className={btnPrimary}>
            {started ? "Continue your path" : "Take the 3-minute assessment"}
            <Icon name="arrowRight" />
          </Link>
        )}
        {supabaseConfigured && !user && (
          <Link href="/login" className={btnGhost}>
            <Icon name="login" /> Sign in to save progress
          </Link>
        )}
      </div>
    </div>
  );
}
