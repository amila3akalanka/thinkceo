"use client";

import Link from "next/link";
import { AppShell, Loading } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { NameCard } from "@/components/NameCard";
import { useProgress } from "@/components/ProgressProvider";
import { TraitRadar } from "@/components/TraitRadar";
import { btnGhost, btnPrimary, card } from "@/components/ui";
import { SCENARIOS } from "@/content/scenarios";
import { badgeStatuses } from "@/lib/badges";
import { displayStreak } from "@/lib/progress";
import { rankFor } from "@/lib/ranks";
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
  const rank = rankFor(progress.xp);
  const badges = badgeStatuses(progress);
  const earnedCount = badges.filter((b) => b.earned).length;

  const stats = [
    { icon: "star", tone: "soft", label: "XP", value: progress.xp },
    { icon: "flame", tone: "softOrange", label: "Day streak", value: displayStreak(progress, new Date()) },
    { icon: "check", tone: "green", label: "Cases done", value: new Set(attempts.map((a) => a.scenarioId)).size },
    { icon: "gauge", tone: "softOrange", label: "Avg case score", value: avgScore },
    { icon: "graduation", tone: "soft", label: "Lessons done", value: new Set(progress.lessons.map((l) => l.lessonId)).size },
    { icon: "award", tone: "softOrange", label: "Badges", value: `${earnedCount}/${badges.length}` },
  ] as const;

  return (
    <AppShell>
      <NameCard />
      <div className="rounded-3xl bg-linear-to-br from-violet-500 to-violet-700 p-5 text-white shadow-xl shadow-violet-300/50">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20">
            <Icon name={rank.current.icon} className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-bold text-violet-100 uppercase">Career rank</p>
            <p className="text-2xl font-extrabold">{rank.current.title}</p>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-bold">{progress.xp} XP</span>
        </div>
        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-orange-300" style={{ width: `${rank.percentToNext}%` }} />
        </div>
        <p className="mt-2 text-sm text-violet-100">
          {rank.next
            ? `${rank.next.minXp - progress.xp} XP to ${rank.next.title}. Play cases and finish lessons to climb.`
            : "You reached the top. Keep your streak alive!"}
        </p>
      </div>

      <div className={`${card} mt-4`}>
        <div className="flex items-center justify-between">
          <p className="font-extrabold">Badges</p>
          <span className="text-sm font-bold text-violet-500">
            {earnedCount}/{badges.length}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {badges.map(({ badge, earned, current, target }) => (
            <div
              key={badge.id}
              className={`flex flex-col items-center rounded-2xl p-3 text-center ${earned ? "bg-violet-50" : "bg-slate-50"}`}
              title={badge.description}
            >
              <IconBadge name={earned ? badge.icon : "lock"} tone={earned ? badge.tone : "locked"} />
              <p className={`mt-2 text-xs leading-tight font-bold ${earned ? "" : "text-slate-400"}`}>{badge.title}</p>
              <p className="mt-0.5 text-[10px] leading-tight text-violet-900/50">
                {earned ? badge.description : `${current}/${target}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {assessment ? (
        <div className={`${card} mt-4`}>
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
        <div className={`${card} mt-4`}>
          <p className="font-bold">No leader profile yet.</p>
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

      <Link href="/about" className={`${btnGhost} mt-4`}>
        <Icon name="info" /> About ThinkCEO
      </Link>
    </AppShell>
  );
}
