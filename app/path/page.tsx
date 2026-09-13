"use client";

import Link from "next/link";
import { AppShell, Loading } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { btnGhost, card } from "@/components/ui";
import { SCENARIOS } from "@/content/scenarios";
import { nextScenario, scenariosFor } from "@/lib/pathBuilder";
import { reflect } from "@/lib/scoring";
import { MODULES } from "@/lib/traits";
import { MODULE_IDS } from "@/lib/types";

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Difficulty ${level} of 3`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={`h-1.5 w-1.5 rounded-full ${n <= level ? "bg-orange-400" : "bg-violet-100"}`} />
      ))}
    </span>
  );
}

export default function PathPage() {
  const { progress } = useProgress();
  if (!progress) return <AppShell><Loading /></AppShell>;

  const path = progress.path.length ? progress.path : [...MODULE_IDS];
  const latest = new Map(progress.attempts.map((a) => [a.scenarioId, a]));
  const next = nextScenario(progress.path, progress.attempts);
  const insight = reflect(progress.attempts, SCENARIOS);

  return (
    <AppShell>
      {!progress.assessment && (
        <div className={`${card} mb-4 flex items-center gap-4`}>
          <IconBadge name="brain" tone="violet" />
          <div className="flex-1">
            <p className="font-bold">Personalize your path</p>
            <p className="text-sm text-violet-900/60">Take the 3-minute assessment.</p>
          </div>
          <Link href="/onboarding" className="font-bold text-violet-600">Start</Link>
        </div>
      )}

      {next ? (
        <div className="rounded-3xl bg-linear-to-br from-orange-400 to-orange-500 p-5 text-white shadow-xl shadow-orange-300/50">
          <p className="text-sm font-semibold text-orange-50">Next up</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20">
              <Icon name={next.icon} className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xl font-extrabold">{next.company}</p>
              <p className="text-sm text-orange-50">{next.year} · {MODULES[next.module].title}</p>
            </div>
          </div>
          <Link
            href={`/play/${next.id}`}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 font-bold text-orange-600 transition active:scale-[.98]"
          >
            <Icon name="play" /> Play case
          </Link>
        </div>
      ) : (
        <div className={`${card} text-center`}>
          <IconBadge name="trophy" tone="orange" size="lg" />
          <p className="mt-3 text-xl font-extrabold">Path complete!</p>
          <p className="text-sm text-violet-900/60">New cases are on the way. Replay any case below.</p>
        </div>
      )}

      {insight && (
        <div className="mt-4 flex items-start gap-3 rounded-3xl bg-violet-50 p-4 ring-1 ring-violet-200">
          <IconBadge name="lightbulb" tone="soft" size="sm" />
          <div>
            <p className="text-xs font-bold text-violet-500 uppercase">Your pattern</p>
            <p className="font-semibold">{insight}</p>
          </div>
        </div>
      )}

      <h2 className="mt-8 mb-3 text-lg font-extrabold">Your learning path</h2>
      <div className="space-y-4">
        {path.map((moduleId, i) => {
          const mod = MODULES[moduleId];
          const cases = scenariosFor(moduleId);
          const done = cases.filter((s) => latest.has(s.id)).length;
          return (
            <section key={moduleId} className={card}>
              <div className="flex items-center gap-3">
                <IconBadge name={mod.icon} tone={i === 0 ? "orange" : "violet"} />
                <div className="flex-1">
                  <p className="text-xs font-bold text-violet-400">MODULE {i + 1}</p>
                  <p className="font-extrabold">{mod.title}</p>
                  <p className="text-xs text-violet-900/60">{mod.tagline}</p>
                </div>
                <span className="text-sm font-bold text-violet-500">{done}/{cases.length}</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-violet-500 to-orange-400"
                  style={{ width: `${cases.length ? (done / cases.length) * 100 : 0}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {cases.map((s) => {
                  const attempt = latest.get(s.id);
                  const isNext = next?.id === s.id;
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/play/${s.id}`}
                        className={`flex items-center gap-3 rounded-2xl p-2 transition hover:bg-violet-50 ${isNext ? "bg-orange-50 ring-1 ring-orange-200" : ""}`}
                      >
                        <IconBadge name={s.icon} tone={attempt ? "green" : isNext ? "softOrange" : "soft"} size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-bold">{s.company}</p>
                          <div className="flex items-center gap-2 text-xs text-violet-900/50">
                            {s.year} <DifficultyDots level={s.difficulty} />
                          </div>
                        </div>
                        {attempt ? (
                          <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                            <Icon name="check" className="h-4 w-4" /> {attempt.score}
                          </span>
                        ) : (
                          <Icon name={isNext ? "play" : "chevron"} className={`h-5 w-5 ${isNext ? "text-orange-500" : "text-violet-300"}`} />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {progress.assessment && (
        <Link href="/onboarding" className={`${btnGhost} mt-6`}>
          <Icon name="retry" /> Retake assessment
        </Link>
      )}
    </AppShell>
  );
}
