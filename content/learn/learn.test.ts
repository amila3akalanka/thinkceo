import { describe, expect, it } from "vitest";
import { LEARN_CATEGORY_IDS, LessonSchema } from "@/lib/learn";
import { LESSONS, lessonsIn } from "./index";

describe("learn content", () => {
  it.each(LESSONS.map((l) => [l.id, l] as const))("%s is valid and short", (_, lesson) => {
    const result = LessonSchema.safeParse(lesson);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });

  it("has unique lesson ids", () => {
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(LESSONS.length);
  });

  it("has lessons in every category with at most 5 quiz questions", () => {
    for (const category of LEARN_CATEGORY_IDS) {
      const lessons = lessonsIn(category);
      expect(lessons.length).toBeGreaterThan(0);
      for (const lesson of lessons) expect(lesson.quiz.length).toBeLessThanOrEqual(5);
    }
  });

  it("cites sources for every Sri Lanka tax, property and investing lesson", () => {
    for (const lesson of LESSONS.filter((l) => l.category !== "ceo-math")) {
      expect(lesson.references.length, lesson.id).toBeGreaterThan(0);
    }
    for (const lesson of lessonsIn("tax")) {
      expect(lesson.legal && lesson.factsAsOf, lesson.id).toBeTruthy();
    }
  });

  it("includes calculation questions", () => {
    const numeric = LESSONS.flatMap((l) => l.quiz).filter((q) => q.kind === "numeric");
    expect(numeric.length).toBeGreaterThanOrEqual(20);
  });
});
