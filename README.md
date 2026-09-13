# ThinkCEO

A mobile-first web app that trains you to think like a CEO. It assesses your financial literacy, business knowledge and leadership traits, builds a learning path around your weakest areas, and then gives you short, real business dilemmas from history. Pick an option, and it shows what actually happened, the best move and why.

## Features

- **Assessment** (12 questions, about 3 minutes): finance and business knowledge questions plus situational trait questions (strategy, risk, competitiveness, customer focus, decisiveness). The result is a radar chart and a leader archetype.
- **Personalised path**: six modules (Money Matters, Competitive Strategy, Risk & Bets, Growth Plays, Crisis Leadership, Pricing Power), ordered weakest-first.
- **Case play**: a short setup, 3-4 options and a confidence slider. The reveal shows the best move, what the company really did, the outcome, the lesson and the source.
- **AI coach**: "Explain more" generates a short, personalised explanation from the curated case facts.
- **Progress**: XP, day streaks, a profile that updates as you play, pattern reflections and a confidence calibration check.
- **Guest mode or accounts**: runs with no setup (progress stored in localStorage). Add Supabase keys to enable Google or magic-link sign-in with synced progress.

## Stack (free tiers)

Next.js 15 (App Router) · Tailwind CSS v4 · Framer Motion · Lucide icons · Recharts · Zod · Supabase (Auth + Postgres + RLS) · Gemini Flash free tier (Claude optional) · Vitest · Vercel Hobby

## Getting started

Full step-by-step instructions are in [SETUP.md](SETUP.md). Quick start:

```bash
npm install
cp .env.example .env.local   # optional: add keys
npm run dev
```

Open http://localhost:3000.

### Enable accounts (optional)

1. Create a free project at https://supabase.com.
2. Run `supabase/migrations/0001_init.sql` in the SQL editor.
3. Under Authentication → URL Configuration, add `http://localhost:3000/auth/callback` (and your Vercel URL) to the redirect URLs. Enable the Google provider if you want Google sign-in.
4. Put the project URL and anon key in `.env.local`.

### Enable the AI coach (optional)

Get a free Gemini key at https://aistudio.google.com/apikey and set `GEMINI_API_KEY`. To use Claude instead, set `LLM_PROVIDER=anthropic` and `ANTHROPIC_API_KEY`.

## Adding scenarios

Curated cases live in `content/scenarios.ts`. Every case is validated by `ScenarioSchema` in `lib/types.ts`, which enforces word limits so screens stay short (setup ≤ 60 words, options ≤ 12, outcome ≤ 50).

To draft a new case with the LLM:

```bash
npm run generate:scenario -- "Nokia responds to the iPhone 2007" strategy
```

The draft goes to `content/drafts/` (git-ignored). Fact-check it, then copy it into `content/scenarios.ts`. `npm test` will fail if it breaks the schema.

## Project layout

```
app/                 pages: landing, onboarding, onboarding/result, path, play/[scenarioId], profile, login
app/api/explain      AI coach endpoint
app/auth/callback    Supabase sign-in callback
components/          AppShell, Icon/IconBadge, TraitRadar, ProgressProvider, ui class helpers
content/             assessment questions and curated scenarios
lib/                 scoring, pathBuilder, progress (XP/streak), store (local + Supabase), llm, types
scripts/             generate-scenario.ts
supabase/migrations  database schema and RLS policies
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run unit and content tests |
| `npm run lint` | Lint |
| `npm run build` | Production build |
| `npm run generate:scenario -- "<case>" <module>` | Draft a scenario with the LLM |

## Known POC limits

- Guest progress is not migrated when a guest signs in later.
- The explain endpoint has no rate limiting; add one before a public launch.
- 14 curated cases so far (2-3 per module); the plan is 5 per module.
