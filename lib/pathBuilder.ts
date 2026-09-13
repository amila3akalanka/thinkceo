import { SCENARIOS } from "@/content/scenarios";
import { MODULES } from "./traits";
import { MODULE_IDS, type Attempt, type ModuleId, type Scenario, type Scores } from "./types";

/** Weakest-first: modules whose dimensions score lowest come first. Ties keep the default order. */
export function buildPath(scores: Scores): ModuleId[] {
  return MODULE_IDS.map((id, index) => {
    const dims = MODULES[id].dims;
    const need = dims.reduce((sum, d) => sum + (100 - scores[d]), 0) / dims.length;
    return { id, index, need };
  })
    .sort((a, b) => b.need - a.need || a.index - b.index)
    .map((m) => m.id);
}

export function scenariosFor(moduleId: ModuleId, scenarios: Scenario[] = SCENARIOS): Scenario[] {
  return scenarios.filter((s) => s.module === moduleId).sort((a, b) => a.difficulty - b.difficulty);
}

export function nextScenario(
  path: ModuleId[],
  attempts: Pick<Attempt, "scenarioId">[],
  scenarios: Scenario[] = SCENARIOS,
): Scenario | null {
  const done = new Set(attempts.map((a) => a.scenarioId));
  const order = path.length ? path : [...MODULE_IDS];
  for (const moduleId of order) {
    const next = scenariosFor(moduleId, scenarios).find((s) => !done.has(s.id));
    if (next) return next;
  }
  return null;
}
