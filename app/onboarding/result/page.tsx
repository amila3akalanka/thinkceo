"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { AppShell, Loading } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { TraitRadar } from "@/components/TraitRadar";
import { btnPrimary, card, chip } from "@/components/ui";
import { nextScenario } from "@/lib/pathBuilder";
import { ARCHETYPES, DIMENSION_META, MODULES } from "@/lib/traits";
import { DIMENSIONS } from "@/lib/types";

export default function ResultPage() {
  const { progress } = useProgress();

  if (!progress) return <AppShell><Loading /></AppShell>;

  const assessment = progress.assessment;
  if (!assessment) {
    return (
      <AppShell>
        <div className={card}>
          <p className="font-bold">No assessment yet.</p>
          <Link href="/onboarding" className={`${btnPrimary} mt-4`}>Start assessment</Link>
        </div>
      </AppShell>
    );
  }

  const archetype = ARCHETYPES[assessment.archetype];
  const ranked = [...DIMENSIONS].sort((a, b) => assessment.scores[b] - assessment.scores[a]);
  const next = nextScenario(progress.path, progress.attempts);

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-linear-to-br from-violet-500 to-violet-700 p-6 text-white shadow-xl shadow-violet-300/50"
      >
        <p className="text-sm font-semibold text-violet-100">Your leader profile</p>
        <div className="mt-3 flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15">
            <Icon name={archetype.icon} className="h-8 w-8" />
          </span>
          <h1 className="text-2xl font-extrabold">{archetype.title}</h1>
        </div>
        <p className="mt-4 text-violet-50">{archetype.blurb}</p>
      </motion.div>

      <div className={`${card} mt-4`}>
        <TraitRadar scores={assessment.scores} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="mb-2 text-xs font-bold text-emerald-600 uppercase">Strengths</p>
            {ranked.slice(0, 2).map((d) => (
              <span key={d} className={`${chip} mr-1 mb-1 bg-emerald-50 text-emerald-700`}>
                <Icon name={DIMENSION_META[d].icon} className="h-3.5 w-3.5" />
                {DIMENSION_META[d].short} {assessment.scores[d]}
              </span>
            ))}
          </div>
          <div>
            <p className="mb-2 text-xs font-bold text-orange-600 uppercase">Focus areas</p>
            {ranked.slice(-2).map((d) => (
              <span key={d} className={`${chip} mr-1 mb-1 bg-orange-50 text-orange-700`}>
                <Icon name={DIMENSION_META[d].icon} className="h-3.5 w-3.5" />
                {DIMENSION_META[d].short} {assessment.scores[d]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={`${card} mt-4`}>
        <p className="font-extrabold">Your learning path starts with</p>
        <ol className="mt-3 space-y-3">
          {progress.path.slice(0, 3).map((id, i) => (
            <li key={id} className="flex items-center gap-3">
              <IconBadge name={MODULES[id].icon} tone={i === 0 ? "orange" : "soft"} size="sm" />
              <div>
                <p className="font-bold">{MODULES[id].title}</p>
                <p className="text-xs text-violet-900/60">{MODULES[id].tagline}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <Link href={next ? `/play/${next.id}` : "/path"} className={`${btnPrimary} mt-6`}>
        Start your first case <Icon name="arrowRight" />
      </Link>
    </AppShell>
  );
}
