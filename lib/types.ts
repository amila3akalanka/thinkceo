import { z } from "zod";

export const DIMENSIONS = [
  "finance",
  "business",
  "strategy",
  "risk",
  "competitive",
  "customer",
  "decisive",
] as const;
export type Dimension = (typeof DIMENSIONS)[number];

export const TRAITS = ["strategy", "risk", "competitive", "customer", "decisive"] as const;
export type Trait = (typeof TRAITS)[number];

export const MODULE_IDS = ["finance", "strategy", "risk", "growth", "crisis", "pricing"] as const;
export type ModuleId = (typeof MODULE_IDS)[number];

export type ArchetypeId = "visionary" | "hustler" | "strategist" | "operator";

export type Scores = Record<Dimension, number>;

const maxWords = (max: number) => (s: string) => s.trim().split(/\s+/).length <= max;

// Trait weights (0-3) describe what a choice signals about the decision-maker.
export const TraitWeightsSchema = z.object({
  strategy: z.number().min(0).max(3).optional(),
  risk: z.number().min(0).max(3).optional(),
  competitive: z.number().min(0).max(3).optional(),
  customer: z.number().min(0).max(3).optional(),
  decisive: z.number().min(0).max(3).optional(),
});
export type TraitWeights = z.infer<typeof TraitWeightsSchema>;

export const OptionSchema = z.object({
  id: z.string(),
  text: z.string().refine(maxWords(12), "option text must be 12 words or fewer"),
  score: z.number().int().min(0).max(100),
  traits: TraitWeightsSchema,
});

// Word limits keep every screen short enough to read in a few seconds.
export const ScenarioSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    module: z.enum(MODULE_IDS),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    company: z.string(),
    year: z.number().int(),
    icon: z.string(),
    setup: z.string().refine(maxWords(60), "setup must be 60 words or fewer"),
    question: z.string().refine(maxWords(15), "question must be 15 words or fewer"),
    options: z.array(OptionSchema).min(3).max(4),
    bestOptionId: z.string(),
    actualOptionId: z.string(),
    actualOutcome: z.string().refine(maxWords(50), "outcome must be 50 words or fewer"),
    whyBest: z.array(z.string().refine(maxWords(20), "bullet must be 20 words or fewer")).min(1).max(3),
    lesson: z.string().refine(maxWords(15), "lesson must be 15 words or fewer"),
    source: z.object({ title: z.string(), url: z.string().url() }),
  })
  .refine(
    (s) =>
      s.options.some((o) => o.id === s.bestOptionId) &&
      s.options.some((o) => o.id === s.actualOptionId),
    "bestOptionId and actualOptionId must match an option id",
  );
export type Scenario = z.infer<typeof ScenarioSchema>;

export type KnowledgeQuestion = {
  id: string;
  kind: "knowledge";
  dimension: "finance" | "business";
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
};

export type TraitQuestion = {
  id: string;
  kind: "trait";
  prompt: string;
  options: { id: string; text: string; traits: TraitWeights }[];
};

export type AssessmentQuestion = KnowledgeQuestion | TraitQuestion;

export type AssessmentResult = {
  scores: Scores;
  archetype: ArchetypeId;
  completedAt: string;
};

export type Attempt = {
  scenarioId: string;
  optionId: string;
  score: number;
  confidence: number;
  xp: number;
  createdAt: string;
};

export type AttemptInput = Omit<Attempt, "xp" | "createdAt">;

export type LessonResult = {
  lessonId: string;
  correct: number;
  total: number;
  xp: number;
  completedAt: string;
};

export type LessonResultInput = Omit<LessonResult, "xp" | "completedAt">;

export type Progress = {
  displayName: string | null;
  assessment: AssessmentResult | null;
  path: ModuleId[];
  attempts: Attempt[];
  lessons: LessonResult[];
  xp: number;
  streak: number;
  lastActive: string | null;
};
