import type { Attempt, AttemptInput, LessonResult, LessonResultInput, Progress } from "./types";

export function emptyProgress(): Progress {
  return {
    displayName: null,
    assessment: null,
    path: [],
    attempts: [],
    lessons: [],
    xp: 0,
    streak: 0,
    lastActive: null,
  };
}

export const MAX_NAME_LENGTH = 40;

/** Trims and collapses spaces. Returns null when the name is empty or too long. */
export function cleanDisplayName(raw: string): string | null {
  const name = raw.trim().replace(/\s+/g, " ");
  return name && name.length <= MAX_NAME_LENGTH ? name : null;
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

/** 5 XP per correct answer, +10 for finishing, +5 for a perfect score. Only the first completion earns XP. */
export function lessonXp(correct: number, total: number, firstTime: boolean): number {
  if (!firstTime) return 0;
  return correct * 5 + 10 + (correct === total ? 5 : 0);
}

/** Streak to show right now: it lapses if the user skipped a full day. */
export function displayStreak(progress: Progress, now: Date): number {
  const { lastActive, streak } = progress;
  return lastActive === dayKey(now) || lastActive === yesterdayKey(now) ? streak : 0;
}

function nextStreak(progress: Progress, now: Date): number {
  if (progress.lastActive === dayKey(now)) return Math.max(progress.streak, 1);
  if (progress.lastActive === yesterdayKey(now)) return progress.streak + 1;
  return 1;
}

/** Pure update used by both local and cloud stores. Replays of a case earn no XP. */
export function applyAttempt(
  progress: Progress,
  input: AttemptInput,
  now: Date,
): { progress: Progress; attempt: Attempt } {
  const firstTry = !progress.attempts.some((a) => a.scenarioId === input.scenarioId);
  const attempt: Attempt = { ...input, xp: firstTry ? xpFor(input.score) : 0, createdAt: now.toISOString() };

  return {
    attempt,
    progress: {
      ...progress,
      attempts: [...progress.attempts, attempt],
      xp: progress.xp + attempt.xp,
      streak: nextStreak(progress, now),
      lastActive: dayKey(now),
    },
  };
}

export function applyLessonResult(
  progress: Progress,
  input: LessonResultInput,
  now: Date,
): { progress: Progress; result: LessonResult } {
  const firstTime = !progress.lessons.some((l) => l.lessonId === input.lessonId);
  const result: LessonResult = {
    ...input,
    xp: lessonXp(input.correct, input.total, firstTime),
    completedAt: now.toISOString(),
  };

  return {
    result,
    progress: {
      ...progress,
      lessons: [...progress.lessons, result],
      xp: progress.xp + result.xp,
      streak: nextStreak(progress, now),
      lastActive: dayKey(now),
    },
  };
}
