"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ASSESSMENT } from "@/content/assessment";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { chip } from "@/components/ui";
import { buildPath } from "@/lib/pathBuilder";
import { archetypeFor, scoreAssessment } from "@/lib/scoring";
import { DIMENSION_META } from "@/lib/traits";

const LETTERS = ["A", "B", "C", "D"];

export default function OnboardingPage() {
  const router = useRouter();
  const { saveAssessment } = useProgress();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = ASSESSMENT[index];
  const meta =
    question.kind === "knowledge"
      ? DIMENSION_META[question.dimension]
      : { label: "Leadership style", icon: "brain" };

  async function choose(optionId: string) {
    if (locked) return;
    setLocked(true);
    const next = { ...answers, [question.id]: optionId };
    setAnswers(next);

    if (index < ASSESSMENT.length - 1) {
      setTimeout(() => {
        setIndex((i) => i + 1);
        setLocked(false);
      }, 250);
      return;
    }

    try {
      const scores = scoreAssessment(ASSESSMENT, next);
      await saveAssessment(
        { scores, archetype: archetypeFor(scores), completedAt: new Date().toISOString() },
        buildPath(scores),
      );
      router.push("/onboarding/result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your results");
      setLocked(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col px-5 py-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (index ? setIndex(index - 1) : router.push("/"))}
          className="grid h-10 w-10 place-items-center rounded-full bg-white text-violet-600 ring-1 ring-violet-100"
          aria-label="Back"
        >
          <Icon name="arrowLeft" />
        </button>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-violet-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-violet-500 to-orange-400 transition-[width] duration-300"
            style={{ width: `${((index + 1) / ASSESSMENT.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-violet-500">
          {index + 1}/{ASSESSMENT.length}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
          className="mt-8 flex flex-1 flex-col"
        >
          <div className="flex items-center gap-3">
            <IconBadge name={meta.icon} tone={question.kind === "trait" ? "orange" : "violet"} />
            <span className={`${chip} ${question.kind === "trait" ? "bg-orange-100 text-orange-700" : "bg-violet-100 text-violet-700"}`}>
              {meta.label}
            </span>
          </div>

          <h1 className="mt-5 text-2xl leading-snug font-extrabold">{question.prompt}</h1>
          {question.kind === "trait" && (
            <p className="mt-2 text-sm text-violet-900/60">No right answer. Pick what you would really do.</p>
          )}

          <div className="mt-6 space-y-3">
            {question.options.map((option, i) => {
              const picked = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left font-semibold ring-2 transition active:scale-[.98] ${
                    picked ? "ring-violet-500" : "ring-violet-100 hover:ring-violet-300"
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${
                      picked ? "bg-violet-500 text-white" : "bg-violet-50 text-violet-600"
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  {option.text}
                </button>
              );
            })}
          </div>

          {error && <p className="mt-4 text-sm font-semibold text-orange-600">{error}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
