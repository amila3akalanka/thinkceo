import type { Attempt, AttemptInput, Progress } from "./types";

export function emptyProgress(): Progress {
  return { assessment: null, path: [], attempts: [], xp: 0, streak: 0, lastActive: null };
}

/** Local calendar day as YYYY-MM-DD. */
export function dayKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function yesterdayKey(now: Date): string {
  return dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
}

export function xpFor(score: number): number {
  return 10 + Math.round(score / 10);
}

/** Streak to show right now: it lapses if the user skipped a full day. */
export function displayStreak(progress: Progress, now: Date): number {
  const { lastActive, streak } = progress;
  return lastActive === dayKey(now) || lastActive === yesterdayKey(now) ? streak : 0;
}

/** Pure update used by both local and cloud stores. Replays of a case earn no XP. */
export function applyAttempt(
  progress: Progress,
  input: AttemptInput,
  now: Date,
): { progress: Progress; attempt: Attempt } {
  const today = dayKey(now);
  const firstTry = !progress.attempts.some((a) => a.scenarioId === input.scenarioId);
  const attempt: Attempt = { ...input, xp: firstTry ? xpFor(input.score) : 0, createdAt: now.toISOString() };

  let streak = 1;
  if (progress.lastActive === today) streak = Math.max(progress.streak, 1);
  else if (progress.lastActive === yesterdayKey(now)) streak = progress.streak + 1;

  return {
    attempt,
    progress: {
      ...progress,
      attempts: [...progress.attempts, attempt],
      xp: progress.xp + attempt.xp,
      streak,
      lastActive: today,
    },
  };
}
