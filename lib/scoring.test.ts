import { describe, expect, it } from "vitest";
import { ASSESSMENT } from "@/content/assessment";
import { SCENARIOS } from "@/content/scenarios";
import { archetypeFor, calibration, currentProfile, reflect, scoreAssessment } from "./scoring";
import type { Attempt, Scores } from "./types";

const flat = (n: number): Scores => ({
  finance: n, business: n, strategy: n, risk: n, competitive: n, customer: n, decisive: n,
});

const attempt = (scenarioId: string, optionId: string, score: number, confidence = 70): Attempt => ({
  scenarioId, optionId, score, confidence, xp: 0, createdAt: "2026-09-13T00:00:00Z",
});

describe("scoreAssessment", () => {
  it("scores knowledge as percent correct", () => {
    const answers: Record<string, string> = {};
    for (const q of ASSESSMENT) if (q.kind === "knowledge") answers[q.id] = q.correctOptionId;
    const scores = scoreAssessment(ASSESSMENT, answers);
    expect(scores.finance).toBe(100);
    expect(scores.business).toBe(100);
  });

  it("gives 0 on knowledge when every answer is wrong", () => {
    const answers: Record<string, string> = {};
    for (const q of ASSESSMENT) {
      if (q.kind === "knowledge") answers[q.id] = q.options.find((o) => o.id !== q.correctOptionId)!.id;
    }
    expect(scoreAssessment(ASSESSMENT, answers).finance).toBe(0);
  });

  it("keeps every score within 0-100", () => {
    const answers = Object.fromEntries(ASSESSMENT.map((q) => [q.id, q.options[0].id]));
    for (const value of Object.values(scoreAssessment(ASSESSMENT, answers))) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});

describe("archetypeFor", () => {
  it("maps risk and strategy to archetypes", () => {
    expect(archetypeFor({ ...flat(50), risk: 80, strategy: 80 })).toBe("visionary");
    expect(archetypeFor({ ...flat(50), risk: 80, strategy: 20 })).toBe("hustler");
    expect(archetypeFor({ ...flat(50), risk: 20, strategy: 80 })).toBe("strategist");
    expect(archetypeFor(flat(20))).toBe("operator");
  });
});

describe("currentProfile", () => {
  it("blends case scores into the dimensions a module trains", () => {
    const profile = currentProfile(flat(50), [attempt("tylenol-recall-1982", "a", 100)], SCENARIOS);
    expect(profile.customer).toBe(70); // crisis trains customer + decisive
    expect(profile.finance).toBe(50);
  });
});

describe("reflect and calibration", () => {
  it("needs five decisions before reflecting", () => {
    expect(reflect([attempt("kodak-digital-1975", "b", 90)], SCENARIOS)).toBeNull();
  });

  it("flags overconfidence", () => {
    const attempts = [attempt("kodak-digital-1975", "a", 15, 100), attempt("new-coke-1985", "a", 20, 100)];
    expect(calibration(attempts, SCENARIOS)?.label).toBe("Overconfident");
  });
});
