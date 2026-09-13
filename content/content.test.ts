import { describe, expect, it } from "vitest";
import { MODULE_IDS, ScenarioSchema } from "@/lib/types";
import { ASSESSMENT } from "./assessment";
import { SCENARIOS } from "./scenarios";

describe("scenario content", () => {
  it.each(SCENARIOS.map((s) => [s.id, s] as const))("%s is valid and short", (_, scenario) => {
    const result = ScenarioSchema.safeParse(scenario);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });

  it("has unique ids", () => {
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
  });

  it("covers every module", () => {
    for (const moduleId of MODULE_IDS) expect(SCENARIOS.some((s) => s.module === moduleId)).toBe(true);
  });
});

describe("assessment content", () => {
  it("has a valid correct answer for every knowledge question", () => {
    for (const q of ASSESSMENT) {
      if (q.kind === "knowledge") expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
    }
  });
});
