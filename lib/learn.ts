import { z } from "zod";

export const LEARN_CATEGORY_IDS = ["ceo-math", "investing", "real-estate", "accounting", "tax"] as const;
export type LearnCategoryId = (typeof LEARN_CATEGORY_IDS)[number];

export const NUMERIC_UNITS = ["LKR", "%", "years", "units", "×"] as const;
export type NumericUnit = (typeof NUMERIC_UNITS)[number];

const maxWords = (max: number) => (s: string) => s.trim().split(/\s+/).length <= max;
const words = (max: number) => z.string().refine(maxWords(max), `must be ${max} words or fewer`);

export const ReferenceSchema = z.object({
  title: z.string(),
  publisher: z.string(),
  url: z.string().url(),
});
export type Reference = z.infer<typeof ReferenceSchema>;

const McqQuestionSchema = z.object({
  id: z.string(),
  kind: z.literal("mcq"),
  prompt: words(40),
  options: z.array(z.object({ id: z.string(), text: words(14) })).min(2).max(4),
  correctOptionId: z.string(),
  explanation: words(40),
});

const NumericQuestionSchema = z.object({
  id: z.string(),
  kind: z.literal("numeric"),
  prompt: words(40),
  answer: z.number(),
  // Absolute tolerance, so rounding differences still count as correct.
  tolerance: z.number().min(0),
  unit: z.enum(NUMERIC_UNITS),
  explanation: words(40),
});

export const QuizQuestionSchema = z.union([McqQuestionSchema, NumericQuestionSchema]);
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const LessonCardSchema = z.object({
  icon: z.string(),
  title: words(8),
  body: words(60),
  example: words(40).optional(),
});

export const LessonSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    category: z.enum(LEARN_CATEGORY_IDS),
    order: z.number().int().min(1),
    title: words(8),
    tagline: words(12),
    icon: z.string(),
    minutes: z.number().int().min(1).max(10),
    // Lessons stating tax or legal facts must cite sources and say when facts were checked.
    legal: z.boolean(),
    factsAsOf: z.string().optional(),
    cards: z.array(LessonCardSchema).min(2).max(6),
    quiz: z.array(QuizQuestionSchema).min(1).max(5),
    references: z.array(ReferenceSchema),
  })
  .superRefine((lesson, ctx) => {
    if (lesson.legal && (!lesson.references.length || !lesson.factsAsOf)) {
      ctx.addIssue({ code: "custom", message: "legal lessons need references and factsAsOf" });
    }
    const ids = new Set<string>();
    for (const q of lesson.quiz) {
      if (ids.has(q.id)) ctx.addIssue({ code: "custom", message: `duplicate question id ${q.id}` });
      ids.add(q.id);
      if (q.kind === "mcq" && !q.options.some((o) => o.id === q.correctOptionId)) {
        ctx.addIssue({ code: "custom", message: `${q.id}: correctOptionId must match an option` });
      }
    }
  });
export type Lesson = z.infer<typeof LessonSchema>;
