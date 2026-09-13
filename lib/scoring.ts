import { MODULES } from "./traits";
import {
  DIMENSIONS,
  TRAITS,
  type ArchetypeId,
  type AssessmentQuestion,
  type Attempt,
  type Dimension,
  type Scenario,
  type Scores,
} from "./types";

function zeroed(): Scores {
  return Object.fromEntries(DIMENSIONS.map((d) => [d, 0])) as Scores;
}

/** Knowledge dimensions = % correct. Trait dimensions = chosen weight / best possible weight. */
export function scoreAssessment(
  questions: AssessmentQuestion[],
  answers: Record<string, string>,
): Scores {
  const got = zeroed();
  const max = zeroed();

  for (const q of questions) {
    const pick = answers[q.id];
    if (q.kind === "knowledge") {
      max[q.dimension] += 1;
      if (pick === q.correctOptionId) got[q.dimension] += 1;
      continue;
    }
    for (const t of TRAITS) {
      max[t] += Math.max(0, ...q.options.map((o) => o.traits[t] ?? 0));
      got[t] += q.options.find((o) => o.id === pick)?.traits[t] ?? 0;
    }
  }

  return Object.fromEntries(
    DIMENSIONS.map((d) => [d, max[d] ? Math.round((got[d] / max[d]) * 100) : 50]),
  ) as Scores;
}

export function archetypeFor(scores: Scores): ArchetypeId {
  const bold = scores.risk >= 60;
  const strategic = scores.strategy >= 60;
  if (bold && strategic) return "visionary";
  if (bold) return "hustler";
  if (strategic) return "strategist";
  return "operator";
}

/** Blend the assessment baseline with how the user performs on cases that train each dimension. */
export function currentProfile(baseline: Scores, attempts: Attempt[], scenarios: Scenario[]): Scores {
  const byId = new Map(scenarios.map((s) => [s.id, s]));
  const buckets = Object.fromEntries(DIMENSIONS.map((d) => [d, [] as number[]])) as Record<
    Dimension,
    number[]
  >;

  for (const a of attempts) {
    const s = byId.get(a.scenarioId);
    if (!s) continue;
    for (const d of MODULES[s.module].dims) buckets[d].push(a.score);
  }

  return Object.fromEntries(
    DIMENSIONS.map((d) => {
      const list = buckets[d];
      if (!list.length) return [d, baseline[d]];
      const avg = list.reduce((sum, n) => sum + n, 0) / list.length;
      return [d, Math.round(baseline[d] * 0.6 + avg * 0.4)];
    }),
  ) as Scores;
}

/** A short pattern observation once the user has enough decisions on record. */
export function reflect(attempts: Attempt[], scenarios: Scenario[]): string | null {
  if (attempts.length < 5) return null;
  const byId = new Map(scenarios.map((s) => [s.id, s]));
  let bold = 0;
  let best = 0;
  for (const a of attempts) {
    const s = byId.get(a.scenarioId);
    const option = s?.options.find((o) => o.id === a.optionId);
    if ((option?.traits.risk ?? 0) >= 2) bold += 1;
    if (s?.bestOptionId === a.optionId) best += 1;
  }
  const pct = (n: number) => Math.round((n / attempts.length) * 100);

  if (pct(best) >= 70) return `You picked the best move ${pct(best)}% of the time. Ready for harder cases.`;
  if (pct(bold) >= 60) return `You go bold ${pct(bold)}% of the time. Check the downside before you leap.`;
  if (pct(bold) <= 20) return `You play it safe ${pct(100 - bold)}% of the time. Sometimes standing still is the risk.`;
  return `Balanced so far: ${pct(best)}% best moves. Keep going.`;
}

export function calibration(attempts: Attempt[], scenarios: Scenario[]) {
  if (!attempts.length) return null;
  const byId = new Map(scenarios.map((s) => [s.id, s]));
  const avgConfidence = Math.round(attempts.reduce((sum, a) => sum + a.confidence, 0) / attempts.length);
  const bestRate = Math.round(
    (attempts.filter((a) => byId.get(a.scenarioId)?.bestOptionId === a.optionId).length / attempts.length) * 100,
  );
  const gap = avgConfidence - bestRate;
  const label = gap > 15 ? "Overconfident" : gap < -15 ? "Underconfident" : "Well calibrated";
  return { avgConfidence, bestRate, label };
}
