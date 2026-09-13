// Drafts a new scenario with the LLM for human review.
// Usage: npm run generate:scenario -- "Intel exits memory chips 1985" strategy
// Output: content/drafts/<id>.json. Verify every fact before adding it to content/scenarios.ts.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SCENARIOS } from "../content/scenarios";
import { generateText } from "../lib/llm";
import { MODULE_IDS, ScenarioSchema, type ModuleId } from "../lib/types";

async function main() {
  const [topic, moduleArg = "strategy"] = process.argv.slice(2);
  if (!topic || !MODULE_IDS.includes(moduleArg as ModuleId)) {
    console.error(`Usage: npm run generate:scenario -- "<real business case>" <${MODULE_IDS.join("|")}>`);
    process.exit(1);
  }

  const prompt = `Create one multiple-choice business decision scenario about this real, well-documented case: "${topic}".

Return ONLY a JSON object with exactly the same shape as this example:
${JSON.stringify(SCENARIOS[0], null, 2)}

Rules:
- module must be "${moduleArg}". id is kebab-case: company-topic-year.
- setup: 60 words or fewer, written in present tense from the decision-maker's seat, no hindsight.
- question: 15 words or fewer. 3-4 options, each 12 words or fewer, all plausible.
- score each option 0-100 on decision quality given what was knowable then.
- traits: 0-3 weights for strategy, risk, competitive, customer, decisive.
- actualOptionId is what the company really did; bestOptionId may differ.
- actualOutcome: 50 words or fewer. whyBest: up to 3 bullets of 20 words or fewer. lesson: 15 words or fewer.
- icon: one of film, camera, cpu, house, plane, blocks, soda, truck, coffee, cloud, pill, pizza, music, package, rocket, briefcase, coins.
- Only use facts you are confident are accurate. Leave out any number you are unsure of.
- source.url must be the Wikipedia article for the company or event.`;

  const raw = await generateText(prompt, { maxTokens: 2000, json: true });
  const json = JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  const result = ScenarioSchema.safeParse(json);

  const dir = join(process.cwd(), "content", "drafts");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${json.id ?? "draft"}.json`);
  writeFileSync(file, JSON.stringify(json, null, 2));

  console.log(`Draft written to ${file}`);
  if (!result.success) {
    console.warn("Draft needs fixes before use:");
    for (const issue of result.error.issues) console.warn(`- ${issue.path.join(".")}: ${issue.message}`);
  }
  console.log("Fact-check the draft, then add it to content/scenarios.ts.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
