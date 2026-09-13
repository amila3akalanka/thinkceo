import { describe, expect, it } from "vitest";
import { applyAttempt, displayStreak, emptyProgress } from "./progress";

const input = { scenarioId: "kodak-digital-1975", optionId: "b", score: 90, confidence: 80 };
const day = (d: number) => new Date(2026, 8, d, 12);

describe("applyAttempt", () => {
  it("awards XP and starts a streak on the first decision", () => {
    const { progress, attempt } = applyAttempt(emptyProgress(), input, day(13));
    expect(attempt.xp).toBe(19);
    expect(progress.xp).toBe(19);
    expect(progress.streak).toBe(1);
    expect(progress.lastActive).toBe("2026-09-13");
  });

  it("gives no XP for replaying a case", () => {
    const first = applyAttempt(emptyProgress(), input, day(13)).progress;
    expect(applyAttempt(first, input, day(13)).attempt.xp).toBe(0);
  });

  it("grows the streak on consecutive days and resets after a gap", () => {
    const d1 = applyAttempt(emptyProgress(), input, day(10)).progress;
    const d2 = applyAttempt(d1, { ...input, scenarioId: "new-coke-1985" }, day(11)).progress;
    expect(d2.streak).toBe(2);
    const d5 = applyAttempt(d2, { ...input, scenarioId: "fedex-blackjack-1973" }, day(14)).progress;
    expect(d5.streak).toBe(1);
  });

  it("shows a lapsed streak as zero", () => {
    const p = applyAttempt(emptyProgress(), input, day(10)).progress;
    expect(displayStreak(p, day(11))).toBe(1);
    expect(displayStreak(p, day(13))).toBe(0);
  });
});
