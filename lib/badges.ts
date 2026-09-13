import { lessonsIn, LESSONS } from "@/content/learn";
import { SCENARIOS } from "@/content/scenarios";
import type { LearnCategoryId } from "./learn";
import { dayKey } from "./progress";
import type { Progress } from "./types";

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  tone: "violet" | "orange";
  /** Returns how far the user is towards the badge. Earned when current >= target. */
  measure(progress: Progress): { current: number; target: number };
};

export type BadgeStatus = { badge: Badge; earned: boolean; current: number; target: number };

// Badges are derived from progress, so nothing extra is stored in the database.
const casesPlayed = (p: Progress) => new Set(p.attempts.map((a) => a.scenarioId)).size;
const lessonsDone = (p: Progress) => new Set(p.lessons.map((l) => l.lessonId));

function categoryBadge(
  id: string,
  title: string,
  category: LearnCategoryId,
  categoryName: string,
  icon: string,
  tone: Badge["tone"],
): Badge {
  const lessons = lessonsIn(category);
  return {
    id,
    title,
    description: `Finish every ${categoryName} lesson`,
    icon,
    tone,
    measure: (p) => {
      const done = lessonsDone(p);
      return { current: lessons.filter((l) => done.has(l.id)).length, target: lessons.length };
    },
  };
}

export const BADGES: Badge[] = [
  {
    id: "first-call",
    title: "First Call",
    description: "Make your first CEO decision",
    icon: "zap",
    tone: "orange",
    measure: (p) => ({ current: Math.min(casesPlayed(p), 1), target: 1 }),
  },
  {
    id: "deal-maker",
    title: "Deal Maker",
    description: "Play 5 different cases",
    icon: "briefcase",
    tone: "violet",
    measure: (p) => ({ current: Math.min(casesPlayed(p), 5), target: 5 }),
  },
  {
    id: "sharp-instinct",
    title: "Sharp Instinct",
    description: "Pick the best move in 5 cases",
    icon: "target",
    tone: "orange",
    measure: (p) => {
      const best = new Set(
        p.attempts
          .filter((a) => SCENARIOS.find((s) => s.id === a.scenarioId)?.bestOptionId === a.optionId)
          .map((a) => a.scenarioId),
      );
      return { current: Math.min(best.size, 5), target: 5 };
    },
  },
  {
    id: "boardroom-legend",
    title: "Boardroom Legend",
    description: "Play every case",
    icon: "crown",
    tone: "violet",
    measure: (p) => ({ current: casesPlayed(p), target: SCENARIOS.length }),
  },
  {
    id: "curious-mind",
    title: "Curious Mind",
    description: "Finish your first lesson",
    icon: "book",
    tone: "orange",
    measure: (p) => ({ current: Math.min(lessonsDone(p).size, 1), target: 1 }),
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    description: "Answer every question right in a lesson quiz",
    icon: "star",
    tone: "violet",
    measure: (p) => ({ current: p.lessons.some((l) => l.correct === l.total) ? 1 : 0, target: 1 }),
  },
  categoryBadge("number-cruncher", "Number Cruncher", "ceo-math", "CEO Math", "calculator", "orange"),
  categoryBadge("smart-investor", "Smart Investor", "investing", "Investing", "trending", "violet"),
  categoryBadge("property-pro", "Property Pro", "real-estate", "Real Estate", "house", "orange"),
  categoryBadge("bookkeeper", "Bookkeeper", "accounting", "Accounting", "file", "violet"),
  categoryBadge("tax-savvy", "Tax Savvy", "tax", "Corporate Taxes", "landmark", "orange"),
  {
    id: "all-rounder",
    title: "All-Rounder",
    description: "Finish every lesson in Learn",
    icon: "graduation",
    tone: "violet",
    measure: (p) => {
      const done = lessonsDone(p);
      return { current: LESSONS.filter((l) => done.has(l.id)).length, target: LESSONS.length };
    },
  },
  {
    id: "committed",
    title: "Committed",
    description: "Learn or play on 5 different days",
    icon: "flame",
    tone: "orange",
    measure: (p) => {
      const days = new Set([
        ...p.attempts.map((a) => dayKey(new Date(a.createdAt))),
        ...p.lessons.map((l) => dayKey(new Date(l.completedAt))),
      ]);
      return { current: Math.min(days.size, 5), target: 5 };
    },
  },
];

export function badgeStatuses(progress: Progress): BadgeStatus[] {
  return BADGES.map((badge) => {
    const { current, target } = badge.measure(progress);
    return { badge, current, target, earned: current >= target };
  });
}

export function earnedBadgeIds(progress: Progress): Set<string> {
  return new Set(badgeStatuses(progress).filter((s) => s.earned).map((s) => s.badge.id));
}
