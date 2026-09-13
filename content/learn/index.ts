import { LEARN_CATEGORY_IDS, type LearnCategoryId, type Lesson } from "@/lib/learn";
import { ACCOUNTING } from "./accounting";
import { CEO_MATH } from "./ceoMath";
import { INVESTING } from "./investing";
import { REAL_ESTATE } from "./realEstate";
import { TAX } from "./tax";

export const LEARN_CATEGORIES: Record<
  LearnCategoryId,
  { title: string; tagline: string; icon: string; tone: "violet" | "orange" }
> = {
  "ceo-math": { title: "CEO Math", tagline: "Numbers every leader checks", icon: "calculator", tone: "violet" },
  investing: { title: "Investing in Sri Lanka", tagline: "Shares, deposits, T-bills and gold", icon: "trending", tone: "orange" },
  "real-estate": { title: "Real Estate", tagline: "Buying, renting and selling property", icon: "house", tone: "violet" },
  accounting: { title: "Basic Accounting", tagline: "Read the numbers behind a business", icon: "file", tone: "orange" },
  tax: { title: "Corporate Taxes", tagline: "Sri Lanka tax essentials, simplified", icon: "landmark", tone: "violet" },
};

export const LESSONS: Lesson[] = [...CEO_MATH, ...INVESTING, ...REAL_ESTATE, ...ACCOUNTING, ...TAX].sort(
  (a, b) =>
    LEARN_CATEGORY_IDS.indexOf(a.category) - LEARN_CATEGORY_IDS.indexOf(b.category) || a.order - b.order,
);

export function lessonsIn(category: LearnCategoryId): Lesson[] {
  return LESSONS.filter((l) => l.category === category);
}
