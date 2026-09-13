"use client";

import Link from "next/link";
import { AppShell, Loading } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { TraitRadar } from "@/components/TraitRadar";
import { btnGhost, btnPrimary, card } from "@/components/ui";
import { SCENARIOS } from "@/content/scenarios";
import { displayStreak } from "@/lib/progress";
import { calibration, currentProfile } from "@/lib/scoring";
import { supabaseConfigured } from "@/lib/supabase";
import { ARCHETYPES } from "@/lib/traits";

export default function ProfilePage() {
  const { progress, user, signOut } = useProgress();
  if (!progress) return <AppShell><Loading /></AppShell>;

  const { assessment, attempts } = progress;
  const cal = calibration(attempts, SCENARIOS);
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
    : 0;

  const stats = [
    { icon: "star", tone: "soft", label: "XP", value: progress.xp },
    { icon: "flame", tone: "softOrange", label: "Day streak", value: displayStreak(progress, new Date()) },
    { icon: "check", tone: "green", label: "Cases done", value: new Set(attempts.map((a) => a.scenarioId)).size },
    { icon: "gauge", tone: "softOrange", label: "Avg score", value: avgScore },
  ] as const;

  return (
    <AppShell>
      {assessment ? (
        <div className={card}>
          <div className="flex items-center gap-3">
            <IconBadge name={ARCHETYPES[assessment.archetype].icon} tone="violet" />
            <div>
              <p className="text-xs font-bold text-violet-400 uppercase">Leader profile</p>
              <p className="text-xl font-extrabold">{ARCHETYPES[assessment.archetype].title}</p>
            </div>
          </div>
          <TraitRadar scores={currentProfile(assessment.scores, attempts, SCENARIOS)} baseline={assessment.scores} />
          <div className="flex justify-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-violet-600"><span className="h-2 w-4 rounded bg-violet-500" /> Now</span>
            <span className="flex items-center gap-1 text-orange-600"><span className="h-2 w-4 rounded bg-orange-400" /> At start</span>
          </div>
        </div>
      ) : (
        <div className={card}>
          <p className="font-bold">No profile yet.</p>
          <Link href="/onboarding" className={`${btnPrimary} mt-4`}>Take the assessment</Link>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`${card} p-4`}>
            <IconBadge name={s.icon} tone={s.tone} size="sm" />
            <p className="mt-2 text-2xl font-extrabold">{s.value}</p>
            <p className="text-xs font-semibold text-violet-900/60">{s.label}</p>
          </div>
        ))}
      </div>

      {cal && (
        <div className={`${card} mt-4`}>
          <p className="flex items-center gap-2 font-extrabold">
            <IconBadge name="target" tone="softOrange" size="sm" /> Confidence check: {cal.label}
          </p>
          <p className="mt-2 text-sm text-violet-900/70">
            You feel {cal.avgConfidence}% sure on average and pick the best move {cal.bestRate}% of the time.
          </p>
        </div>
      )}

      <div className={`${card} mt-4`}>
        {user ? (
          <>
            <p className="text-sm text-violet-900/60">Signed in as</p>
            <p className="font-bold">{user.email}</p>
            <button type="button" onClick={signOut} className={`${btnGhost} mt-4`}>
              <Icon name="logout" /> Sign out
            </button>
          </>
        ) : (
          <>
            <p className="font-bold">Guest mode</p>
            <p className="text-sm text-violet-900/60">Progress is saved on this device only.</p>
            {supabaseConfigured && (
              <Link href="/login" className={`${btnGhost} mt-4`}>
                <Icon name="login" /> Sign in to sync
              </Link>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
