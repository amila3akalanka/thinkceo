// Server-only LLM wrapper. Gemini's free tier keeps the POC at zero cost;
// set LLM_PROVIDER=anthropic to switch to Claude.

type Provider = "gemini" | "anthropic";

function provider(): Provider | null {
  const explicit = process.env.LLM_PROVIDER as Provider | undefined;
  if (explicit === "anthropic" && process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (explicit === "gemini" && process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

export function llmConfigured(): boolean {
  return provider() !== null;
}

type Options = { maxTokens?: number; json?: boolean };

export async function generateText(prompt: string, { maxTokens = 500, json = false }: Options = {}) {
  const p = provider();
  if (p === "gemini") return gemini(prompt, maxTokens, json);
  if (p === "anthropic") return anthropic(prompt, maxTokens);
  throw new Error("No LLM configured. Set GEMINI_API_KEY or ANTHROPIC_API_KEY.");
}

async function gemini(prompt: string, maxTokens: number, json: boolean) {
  const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        // Thinking tokens count against maxOutputTokens on 2.5 models; short answers don't need them.
        thinkingConfig: { thinkingBudget: 0 },
        ...(json ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "";
}

async function anthropic(prompt: string, maxTokens: number) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join("");
}
