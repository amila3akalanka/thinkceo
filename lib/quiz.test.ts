import { describe, expect, it } from "vitest";
import type { QuizQuestion } from "./learn";
import { correctAnswerText, formatValue, isCorrect, parseNumericAnswer } from "./quiz";

const numeric: QuizQuestion = {
  id: "n",
  kind: "numeric",
  prompt: "ROI?",
  answer: 30,
  tolerance: 0.5,
  unit: "%",
  explanation: "x",
};

const mcq: QuizQuestion = {
  id: "m",
  kind: "mcq",
  prompt: "Pick",
  options: [
    { id: "a", text: "Yes" },
    { id: "b", text: "No" },
  ],
  correctOptionId: "a",
  explanation: "x",
};

describe("parseNumericAnswer", () => {
  it.each([
    ["LKR 1,200,000", 1200000],
    ["Rs. 5000", 5000],
    ["30%", 30],
    ["4 years", 4],
    ["-25", -25],
    ["4.8", 4.8],
    ["3×", 3],
  ])("parses %s", (raw, expected) => {
    expect(parseNumericAnswer(raw)).toBe(expected);
  });

  it.each(["", "abc", "1.2.3", "--5"])("rejects %s", (raw) => {
    expect(parseNumericAnswer(raw)).toBeNull();
  });
});

describe("isCorrect", () => {
  it("accepts numeric answers within tolerance", () => {
    expect(isCorrect(numeric, "30")).toBe(true);
    expect(isCorrect(numeric, "30.4%")).toBe(true);
    expect(isCorrect(numeric, "31")).toBe(false);
    expect(isCorrect(numeric, undefined)).toBe(false);
  });

  it("checks multiple choice by option id", () => {
    expect(isCorrect(mcq, "a")).toBe(true);
    expect(isCorrect(mcq, "b")).toBe(false);
  });
});

describe("formatting", () => {
  it("formats values with units", () => {
    expect(formatValue(799000, "LKR")).toBe("LKR 799,000");
    expect(formatValue(4, "years")).toBe("4 years");
    expect(correctAnswerText(numeric)).toBe("30%");
    expect(correctAnswerText(mcq)).toBe("Yes");
  });
});
