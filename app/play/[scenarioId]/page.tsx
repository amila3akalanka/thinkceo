"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Icon, IconBadge } from "@/components/Icon";
import { useProgress } from "@/components/ProgressProvider";
import { btnAccent, btnGhost, btnPrimary, card, chip } from "@/components/ui";
import { SCENARIOS } from "@/content/scenarios";
import { nextScenario } from "@/lib/pathBuilder";
import { MODULES } from "@/lib/traits";
import type { Attempt, Scenario } from "@/lib/types";

const LETTERS = ["A", "B", "C", "D"];

export default function PlayPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  return (
    <AppShell>
      {scenario ? (
        <PlayCase key={scenario.id} scenario={scenario} />
      ) : (
        <div className={card}>
          <p className="font-bold">Case not found.</p>
          <Link href="/path" className={`${btnPrimary} mt-4`}>Back to path</Link>
        </div>
      )}
    </AppShell>
  );
}

function PlayCase({ scenario }: { scenario: Scenario }) {
  const { recordAttempt } = useProgress();
  const [selected, setSelected] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(70);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mod = MODULES[scenario.module];

  async function lockIn() {
    const option = scenario.options.find((o) => o.id === selected);
    if (!option) return;
    setSaving(true);
    setError(null);
    try {
      setAttempt(
        await recordAttempt({ scenarioId: scenario.id, optionId: option.id, score: option.score, confidence }),
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your decision");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className={`${chip} bg-violet-100 text-violet-700`}>
          <Icon name={mod.icon} className="h-3.5 w-3.5" /> {mod.title}
        </span>
        <span className={`${chip} bg-orange-100 text-orange-700`}>
          {"Level " + scenario.difficulty}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <IconBadge name={scenario.icon} tone="violet" size="lg" />
        <div>
          <p className="text-2xl font-extrabold">{scenario.company}</p>
          <p className="font-semibold text-orange-500">{scenario.year}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {attempt ? (
          <Reveal key="reveal" scenario={scenario} attempt={attempt} />
        ) : (
          <motion.div key="decide" exit={{ opacity: 0, y: -10 }}>
            <p className="mt-5 text-lg leading-relaxed">{scenario.setup}</p>
            <p className="mt-4 text-xl font-extrabold">{scenario.question}</p>

            <div className="mt-4 space-y-3">
              {scenario.options.map((option, i) => {
                const picked = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelected(option.id)}
                    className={`flex w-full items-center gap-4 rounded-2xl bg-white p-4 text-left font-semibold ring-2 transition active:scale-[.98] ${
                      picked ? "ring-violet-500 shadow-md shadow-violet-200" : "ring-violet-100 hover:ring-violet-300"
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

            <label className={`${card} mt-5 block p-4`}>
              <span className="flex items-center justify-between text-sm font-bold">
                <span className="flex items-center gap-2">
                  <Icon name="gauge" className="h-4 w-4 text-orange-500" /> How sure are you?
                </span>
                <span className="text-orange-600">{confidence}%</span>
              </span>
              <input
                type="range"
                min={50}
                max={100}
                step={10}
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="mt-3 w-full"
              />
            </label>

            {error && <p className="mt-3 text-sm font-semibold text-orange-600">{error}</p>}

            <button type="button" onClick={lockIn} disabled={!selected || saving} className={`${btnAccent} mt-5`}>
              {saving ? <Icon name="loader" className="h-5 w-5 animate-spin" /> : <Icon name="zap" />}
              Lock in decision
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Reveal({ scenario, attempt }: { scenario: Scenario; attempt: Attempt }) {
  const { progress } = useProgress();
  const [explain, setExplain] = useState<{ state: "idle" | "loading" | "done" | "error"; text: string }>({
    state: "idle",
    text: "",
  });

  const isBest = attempt.optionId === scenario.bestOptionId;
  const picked = scenario.options.find((o) => o.id === attempt.optionId)!;
  const next = progress ? nextScenario(progress.path, progress.attempts) : null;
  const riskTaken = Math.round(((picked.traits.risk ?? 0) / 3) * 100);

  async function loadExplanation() {
    setExplain({ state: "loading", text: "" });
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, optionId: attempt.optionId }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok || !data.text) throw new Error(data.error ?? "No explanation returned");
      setExplain({ state: "done", text: data.text });
    } catch (e) {
      setExplain({ state: "error", text: e instanceof Error ? e.message : "Could not load explanation" });
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-4">
      <div
        className={`flex items-center gap-4 rounded-3xl p-5 text-white shadow-xl ${
          isBest
            ? "bg-linear-to-br from-violet-500 to-violet-700 shadow-violet-300/50"
            : "bg-linear-to-br from-orange-400 to-orange-500 shadow-orange-300/50"
        }`}
      >
        <motion.span
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20"
        >
          <Icon name={isBest ? "trophy" : "lightbulb"} className="h-8 w-8" />
        </motion.span>
        <div className="flex-1">
          <p className="text-lg font-extrabold">{isBest ? "CEO-level call!" : "Good lesson here"}</p>
          <p className="text-sm opacity-90">Your decision scored {attempt.score}/100</p>
        </div>
        {attempt.xp > 0 && (
          <motion.span
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-violet-700"
          >
            +{attempt.xp} XP
          </motion.span>
        )}
      </div>

      <div className="space-y-2">
        {scenario.options.map((option, i) => {
          const best = option.id === scenario.bestOptionId;
          const mine = option.id === attempt.optionId;
          const actual = option.id === scenario.actualOptionId;
          return (
            <div
              key={option.id}
              className={`rounded-2xl bg-white p-3 ring-2 ${best ? "ring-emerald-400" : mine ? "ring-violet-300" : "ring-violet-50 opacity-70"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-extrabold ${
                    best ? "bg-emerald-500 text-white" : "bg-violet-50 text-violet-600"
                  }`}
                >
                  {LETTERS[i]}
                </span>
                <p className="flex-1 text-sm font-semibold">{option.text}</p>
                <span className="text-xs font-bold text-violet-400">{option.score}</span>
              </div>
              {(best || mine || actual) && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-11">
                  {best && <span className={`${chip} bg-emerald-100 text-emerald-700`}><Icon name="check" className="h-3.5 w-3.5" /> Best move</span>}
                  {mine && <span className={`${chip} bg-violet-100 text-violet-700`}><Icon name="user" className="h-3.5 w-3.5" /> Your pick</span>}
                  {actual && <span className={`${chip} bg-orange-100 text-orange-700`}><Icon name="history" className="h-3.5 w-3.5" /> What they did</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={card}>
        <p className="flex items-center gap-2 font-extrabold">
          <IconBadge name="history" tone="softOrange" size="sm" /> What actually happened
        </p>
        <p className="mt-3 leading-relaxed">{scenario.actualOutcome}</p>
      </div>

      <div className={card}>
        <p className="flex items-center gap-2 font-extrabold">
          <IconBadge name="check" tone="green" size="sm" /> Why the best move works
        </p>
        <ul className="mt-3 space-y-2">
          {scenario.whyBest.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className={`${card} space-y-3`}>
        <p className="font-extrabold">Your trade-off</p>
        {[
          { label: "Risk taken", value: riskTaken, bar: "from-orange-300 to-orange-500" },
          { label: "Result", value: attempt.score, bar: "from-violet-400 to-violet-600" },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex justify-between text-xs font-bold text-violet-900/60">
              <span>{row.label}</span>
              <span>{row.value}%</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-violet-50">
              <motion.div
                className={`h-full rounded-full bg-linear-to-r ${row.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${row.value}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-3xl bg-orange-50 p-4 ring-1 ring-orange-200">
        <IconBadge name="lightbulb" tone="orange" size="sm" />
        <div>
          <p className="text-xs font-bold text-orange-600 uppercase">CEO lesson</p>
          <p className="font-bold">{scenario.lesson}</p>
        </div>
      </div>

      {explain.state === "done" ? (
        <div className={`${card} space-y-2`}>
          <p className="flex items-center gap-2 font-extrabold">
            <Icon name="sparkles" className="h-5 w-5 text-violet-500" /> Coach explains
          </p>
          {explain.text.split(/\n+/).map((para) => (
            <p key={para} className="text-sm leading-relaxed">{para}</p>
          ))}
        </div>
      ) : (
        <button type="button" onClick={loadExplanation} disabled={explain.state === "loading"} className={btnGhost}>
          <Icon name={explain.state === "loading" ? "loader" : "sparkles"} className={`h-5 w-5 ${explain.state === "loading" ? "animate-spin" : ""}`} />
          Explain more
        </button>
      )}
      {explain.state === "error" && <p className="text-sm font-semibold text-orange-600">{explain.text}</p>}

      <a
        href={scenario.source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-sm font-semibold text-violet-500"
      >
        <Icon name="book" className="h-4 w-4" /> Based on: {scenario.source.title}
      </a>

      <Link href={next ? `/play/${next.id}` : "/path"} className={btnPrimary}>
        {next ? `Next case: ${next.company}` : "Back to your path"} <Icon name="arrowRight" />
      </Link>
    </motion.div>
  );
}
