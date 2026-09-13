import { NextResponse } from "next/server";
import { z } from "zod";
import { SCENARIOS } from "@/content/scenarios";
import { generateText, llmConfigured } from "@/lib/llm";

const Body = z.object({ scenarioId: z.string().max(80), optionId: z.string().max(10) });

export async function POST(request: Request) {
  if (!llmConfigured()) {
    return NextResponse.json(
      { error: "AI coach is not configured yet. Add GEMINI_API_KEY to .env.local." },
      { status: 503 },
    );
  }

  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // Look the case up server-side so the prompt only contains curated facts.
  const scenario = SCENARIOS.find((s) => s.id === parsed.data.scenarioId);
  const picked = scenario?.options.find((o) => o.id === parsed.data.optionId);
  if (!scenario || !picked) return NextResponse.json({ error: "Case not found" }, { status: 404 });

  const best = scenario.options.find((o) => o.id === scenario.bestOptionId)!;
  const actual = scenario.options.find((o) => o.id === scenario.actualOptionId)!;

  const prompt = `You are a sharp, friendly business coach teaching someone to think like a CEO.

Case: ${scenario.company}, ${scenario.year}.
Situation: ${scenario.setup}
Options: ${scenario.options.map((o) => `"${o.text}"`).join("; ")}
The learner picked: "${picked.text}"
Best move: "${best.text}"
What the company actually did: "${actual.text}"
What happened: ${scenario.actualOutcome}
Key reasons: ${scenario.whyBest.join(" ")}

Write exactly 3 short paragraphs, under 110 words total, plain text, no markdown:
Trade-off: the core tension a CEO faced here.
Your pick: why the learner's choice would likely help or hurt, compared with the best move.
Apply it: one concrete way to use this lesson at work this week.
Use only the facts above. Do not invent numbers, dates or quotes.`;

  try {
    const text = await generateText(prompt, { maxTokens: 400 });
    if (!text.trim()) throw new Error("Empty response");
    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error("explain failed", error);
    return NextResponse.json({ error: "The coach is unavailable right now. Try again soon." }, { status: 502 });
  }
}
