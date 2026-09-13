import { describe, expect, it } from "vitest";
import { lessonsIn } from "@/content/learn";
import { SCENARIOS } from "@/content/scenarios";
import { badgeStatuses, BADGES, earnedBadgeIds } from "./badges";
import { emptyProgress } from "./progress";
import { rankFor } from "./ranks";
import type { Progress } from "./types";

const at = "2026-09-13T10:00:00Z";

describe("badges", () => {
  it("has unique ids and none earned at the start", () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
    expect(earnedBadgeIds(emptyProgress()).size).toBe(0);
  });

  it("awards first-call and sharp-instinct from case attempts", () => {
    const attempts = SCENARIOS.slice(0, 5).map((s) => ({
      scenarioId: s.id,
      optionId: s.bestOptionId,
      score: 90,
      confidence: 70,
      xp: 0,
      createdAt: at,
    }));
    const earned = earnedBadgeIds({ ...emptyProgress(), attempts });
    expect(earned.has("first-call")).toBe(true);
    expect(earned.has("deal-maker")).toBe(true);
    expect(earned.has("sharp-instinct")).toBe(true);
    expect(earned.has("boardroom-legend")).toBe(false);
  });

  it("awards category badges only when every lesson in the category is done", () => {
    const math = lessonsIn("ceo-math");
    const partial: Progress = {
      ...emptyProgress(),
      lessons: math.slice(0, 1).map((l) => ({ lessonId: l.id, correct: 2, total: 4, xp: 0, completedAt: at })),
    };
    expect(earnedBadgeIds(partial).has("number-cruncher")).toBe(false);
    expect(earnedBadgeIds(partial).has("curious-mind")).toBe(true);
    expect(earnedBadgeIds(partial).has("perfect-score")).toBe(false);

    const full: Progress = {
      ...partial,
      lessons: math.map((l) => ({ lessonId: l.id, correct: l.quiz.length, total: l.quiz.length, xp: 0, completedAt: at })),
    };
    expect(earnedBadgeIds(full).has("number-cruncher")).toBe(true);
    expect(earnedBadgeIds(full).has("perfect-score")).toBe(true);
    const status = badgeStatuses(full).find((s) => s.badge.id === "smart-investor");
    expect(status?.current).toBe(0);
  });
});

describe("ranks", () => {
  it("climbs with XP", () => {
    expect(rankFor(0).current.title).toBe("Intern");
    expect(rankFor(59).current.title).toBe("Intern");
    expect(rankFor(60).current.title).toBe("Analyst");
    expect(rankFor(120).percentToNext).toBe(50);
    expect(rankFor(5000)).toMatchObject({ next: null, percentToNext: 100 });
  });
});
