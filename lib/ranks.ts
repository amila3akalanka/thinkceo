// Career ladder driven by XP: each rank is a step closer to thinking like a CEO.
export const RANKS = [
  { title: "Intern", minXp: 0, icon: "user" },
  { title: "Analyst", minXp: 60, icon: "calculator" },
  { title: "Manager", minXp: 180, icon: "briefcase" },
  { title: "Director", minXp: 350, icon: "target" },
  { title: "Vice President", minXp: 550, icon: "trending" },
  { title: "CEO", minXp: 800, icon: "crown" },
] as const;

export type Rank = (typeof RANKS)[number];

export function rankFor(xp: number): { current: Rank; next: Rank | null; percentToNext: number } {
  let index = 0;
  RANKS.forEach((rank, i) => {
    if (xp >= rank.minXp) index = i;
  });
  const current = RANKS[index];
  const next = RANKS[index + 1] ?? null;
  const percentToNext = next
    ? Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
    : 100;
  return { current, next, percentToNext };
}
