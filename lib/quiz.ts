import type { NumericUnit, QuizQuestion } from "./learn";

/** Accepts friendly input like "LKR 1,200,000", "30%", "4 years" or "-25". */
export function parseNumericAnswer(raw: string): number | null {
  const cleaned = raw
    .trim()
    .toLowerCase()
    .replace(/lkr|rs\.?|years?|units?|%|×|,|\s/g, "");
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function isCorrect(question: QuizQuestion, answer: string | undefined): boolean {
  if (answer === undefined) return false;
  if (question.kind === "mcq") return answer === question.correctOptionId;
  const value = parseNumericAnswer(answer);
  return value !== null && Math.abs(value - question.answer) <= question.tolerance;
}

export function formatValue(value: number, unit: NumericUnit): string {
  const n = value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  switch (unit) {
    case "LKR":
      return `LKR ${n}`;
    case "%":
      return `${n}%`;
    case "years":
      return `${n} years`;
    case "×":
      return `${n}×`;
    default:
      return n;
  }
}

export function correctAnswerText(question: QuizQuestion): string {
  if (question.kind === "numeric") return formatValue(question.answer, question.unit);
  return question.options.find((o) => o.id === question.correctOptionId)?.text ?? "";
}
