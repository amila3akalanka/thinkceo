import type { AssessmentQuestion } from "@/lib/types";

export const ASSESSMENT: AssessmentQuestion[] = [
  // Financial literacy
  {
    id: "f1",
    kind: "knowledge",
    dimension: "finance",
    prompt: "A coffee sells for $5 and costs $2 to make. What is the gross margin?",
    options: [
      { id: "a", text: "40%" },
      { id: "b", text: "60%" },
      { id: "c", text: "150%" },
      { id: "d", text: "$3" },
    ],
    correctOptionId: "b",
  },
  {
    id: "f2",
    kind: "knowledge",
    dimension: "finance",
    prompt: "Your company is profitable but can't pay salaries this month. Most likely cause?",
    options: [
      { id: "a", text: "Prices are too low" },
      { id: "b", text: "Customers pay late, so cash is stuck" },
      { id: "c", text: "Too many customers" },
      { id: "d", text: "Taxes are too low" },
    ],
    correctOptionId: "b",
  },
  {
    id: "f3",
    kind: "knowledge",
    dimension: "finance",
    prompt: "You invest $10,000 and get $12,000 back after a year. What is the ROI?",
    options: [
      { id: "a", text: "2%" },
      { id: "b", text: "12%" },
      { id: "c", text: "20%" },
      { id: "d", text: "120%" },
    ],
    correctOptionId: "c",
  },
  {
    id: "f4",
    kind: "knowledge",
    dimension: "finance",
    prompt: "You own 50% of a startup. It sells new shares equal to 20% of the company. Your stake now?",
    options: [
      { id: "a", text: "30%" },
      { id: "b", text: "40%" },
      { id: "c", text: "50%" },
      { id: "d", text: "70%" },
    ],
    correctOptionId: "b",
  },
  // Business knowledge
  {
    id: "b1",
    kind: "knowledge",
    dimension: "business",
    prompt: "Which of these is the strongest competitive moat?",
    options: [
      { id: "a", text: "The lowest price this month" },
      { id: "b", text: "A great ad campaign" },
      { id: "c", text: "Customers lose their data and network if they leave" },
      { id: "d", text: "Hiring more salespeople" },
    ],
    correctOptionId: "c",
  },
  {
    id: "b2",
    kind: "knowledge",
    dimension: "business",
    prompt: "Each customer costs $100 to win and brings $60 profit over their lifetime. You should:",
    options: [
      { id: "a", text: "Spend more to grow faster" },
      { id: "b", text: "Fix acquisition cost or lifetime value before scaling" },
      { id: "c", text: "Ignore it; revenue matters most" },
      { id: "d", text: "Raise money and keep going" },
    ],
    correctOptionId: "b",
  },
  {
    id: "b3",
    kind: "knowledge",
    dimension: "business",
    prompt: "Your product is unique and customers love it. Best pricing approach?",
    options: [
      { id: "a", text: "Cost plus 10%" },
      { id: "b", text: "Match the cheapest competitor" },
      { id: "c", text: "Price on the value customers get" },
      { id: "d", text: "Free forever" },
    ],
    correctOptionId: "c",
  },
  {
    id: "b4",
    kind: "knowledge",
    dimension: "business",
    prompt: "You want to size the market for a dog-walking app in one city. First step?",
    options: [
      { id: "a", text: "City population × $100" },
      { id: "b", text: "Copy a competitor's revenue" },
      { id: "c", text: "Count dog owners who'd pay, and how often" },
      { id: "d", text: "Guess, then adjust later" },
    ],
    correctOptionId: "c",
  },
  // Leadership traits (no right answer)
  {
    id: "t1",
    kind: "trait",
    prompt: "A rival launches a cheaper copy of your product. You…",
    options: [
      { id: "a", text: "Cut prices now to crush them", traits: { competitive: 3, decisive: 3, risk: 1 } },
      { id: "b", text: "Find what customers value most and double down", traits: { strategy: 3, customer: 3 } },
      { id: "c", text: "Wait a quarter to see if it matters", traits: { strategy: 1 } },
      { id: "d", text: "Launch a bold feature they can't copy", traits: { risk: 2, competitive: 2, strategy: 2 } },
    ],
  },
  {
    id: "t2",
    kind: "trait",
    prompt: "You have $1M to invest in the business. Pick one:",
    options: [
      { id: "a", text: "Safe project: small but sure return", traits: { strategy: 1 } },
      { id: "b", text: "Balanced bet: good odds of doubling", traits: { risk: 2, strategy: 2 } },
      { id: "c", text: "Moonshot: long odds, 20× upside", traits: { risk: 3 } },
      { id: "d", text: "Keep it as a cash cushion", traits: {} },
    ],
  },
  {
    id: "t3",
    kind: "trait",
    prompt: "A decision is due today, but you only have 70% of the info. You…",
    options: [
      { id: "a", text: "Decide now and adjust as you go", traits: { decisive: 3, risk: 2 } },
      { id: "b", text: "Delay a week to get more data", traits: { strategy: 1 } },
      { id: "c", text: "Let the team vote", traits: { customer: 1 } },
      { id: "d", text: "Decide now, set a checkpoint to review", traits: { decisive: 3, strategy: 3 } },
    ],
  },
  {
    id: "t4",
    kind: "trait",
    prompt: "Your biggest customer wants a custom feature that derails your roadmap. You…",
    options: [
      { id: "a", text: "Build it; keep them happy", traits: { customer: 3 } },
      { id: "b", text: "Say no; the roadmap comes first", traits: { strategy: 2, decisive: 2 } },
      { id: "c", text: "Find a version that helps all customers", traits: { strategy: 3, customer: 2 } },
      { id: "d", text: "Charge them a premium for it", traits: { competitive: 2, customer: 1 } },
    ],
  },
];
