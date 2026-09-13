import type { ArchetypeId, Dimension, ModuleId } from "./types";

export const DIMENSION_META: Record<Dimension, { label: string; short: string; icon: string }> = {
  finance: { label: "Financial literacy", short: "Finance", icon: "coins" },
  business: { label: "Business knowledge", short: "Business", icon: "briefcase" },
  strategy: { label: "Strategic thinking", short: "Strategy", icon: "target" },
  risk: { label: "Risk appetite", short: "Risk", icon: "dice" },
  competitive: { label: "Competitiveness", short: "Drive", icon: "trophy" },
  customer: { label: "Customer focus", short: "Customer", icon: "heart" },
  decisive: { label: "Decisiveness", short: "Decisive", icon: "zap" },
};

// Each module trains the dimensions listed in `dims`; the path builder uses them.
export const MODULES: Record<
  ModuleId,
  { title: string; tagline: string; icon: string; dims: Dimension[] }
> = {
  finance: { title: "Money Matters", tagline: "Cash, margins and runway", icon: "wallet", dims: ["finance", "business"] },
  strategy: { title: "Competitive Strategy", tagline: "Moats, disruption and focus", icon: "target", dims: ["strategy", "competitive"] },
  risk: { title: "Risk & Bets", tagline: "When to leap, when to wait", icon: "dice", dims: ["risk", "decisive"] },
  growth: { title: "Growth Plays", tagline: "Scale without breaking the core", icon: "trending", dims: ["business", "strategy"] },
  crisis: { title: "Crisis Leadership", tagline: "Protect trust under pressure", icon: "lifebuoy", dims: ["decisive", "customer"] },
  pricing: { title: "Pricing Power", tagline: "Price to change behavior", icon: "tag", dims: ["finance", "customer"] },
};

export const ARCHETYPES: Record<ArchetypeId, { title: string; blurb: string; icon: string }> = {
  visionary: {
    title: "Visionary Builder",
    blurb: "You think long-term and are willing to bet on it. Watch the cash while you chase the big idea.",
    icon: "rocket",
  },
  hustler: {
    title: "Bold Hustler",
    blurb: "You move fast and take shots. Pair that energy with a clear plan so the bets add up.",
    icon: "zap",
  },
  strategist: {
    title: "Careful Strategist",
    blurb: "You see the whole board and weigh options well. Practice pulling the trigger sooner.",
    icon: "compass",
  },
  operator: {
    title: "Steady Operator",
    blurb: "You protect what works and avoid drama. Stretch into strategy and smart risks.",
    icon: "shield",
  },
};
