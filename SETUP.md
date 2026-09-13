# ThinkCEO setup guide

Everything installs inside this project folder (`node_modules/`). Nothing needs to be installed globally. The only machine-level requirement is Node.js.

## 1. Install Node.js (version managed per project)

The project pins Node 22 in `.nvmrc`. Use a version manager so this project's Node doesn't affect other projects.

```bash
brew install nvm
```

Follow the post-install note from Homebrew to add nvm to `~/.zshrc`, then open a new terminal.

```bash
cd /Users/amilaakalanka/Documents/qlub/DE/experiment_projects/thinking_business
nvm install
nvm use
```

`nvm install` and `nvm use` read `.nvmrc`. Any Node version from 20.9 up works; `.npmrc` sets `engine-strict=true`, so older versions are rejected.

## 2. Install project packages

```bash
npm ci
```

`npm ci` installs exactly the versions in `package-lock.json` into `./node_modules`. Use `npm install <pkg>` only when adding a new dependency. `.npmrc` sets `save-exact=true`, so new packages are pinned to exact versions.

CLI tools (Next.js, Vitest, ESLint, tsx) are local dev dependencies. Run them through `npm run …` or `npx …`, which use `./node_modules/.bin`.

## 3. Run the app (guest mode, no keys needed)

```bash
npm run dev
```

Open http://localhost:3000. Progress is stored in the browser's localStorage. For a phone-sized view, open your browser's dev tools and turn on device mode.

## 4. Check everything works

```bash
npm test
```

```bash
npm run lint
```

```bash
npm run build
```

## 5. Optional: enable the AI coach ("Explain more")

1. Create a free Gemini API key at https://aistudio.google.com/apikey.
2. Create your local env file:

   ```bash
   cp .env.example .env.local
   ```

3. Set `GEMINI_API_KEY=` in `.env.local`.
4. Restart `npm run dev`.

`.env.local` is git-ignored. To use Claude instead, set `LLM_PROVIDER=anthropic` and `ANTHROPIC_API_KEY`.

## 6. Optional: enable accounts and synced progress (Supabase)

1. Create a free project at https://supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase/migrations/0001_init.sql`, and run it.
3. Open **Project Settings → API** and copy the Project URL and anon public key into `.env.local`:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   ```

4. Open **Authentication → URL Configuration**. Set Site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` to Redirect URLs.
5. Optional Google sign-in: enable **Authentication → Providers → Google** and follow Supabase's steps to add a Google OAuth client.
6. Restart `npm run dev`. A "Sign in" option now appears on the home and profile pages.

No Supabase CLI is needed. If you want it later, install it locally: `npm install -D supabase`, then run it with `npx supabase`.

## 7. Optional: draft new scenarios with the LLM

Requires step 5.

```bash
npm run generate:scenario -- "Nokia responds to the iPhone 2007" strategy
```

The draft is saved to `content/drafts/`. Fact-check it, copy it into `content/scenarios.ts`, then run `npm test` to validate it.

## 8. Optional: deploy for free (Vercel)

1. Push the project to a GitHub repository.
2. Import the repository at https://vercel.com/new.
3. Add the same variables from `.env.local` under **Settings → Environment Variables**.
4. In Supabase, add `https://<your-app>.vercel.app/auth/callback` to Redirect URLs.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Unsupported engine` during install | Run `nvm use` so Node 20.9 or newer is active. |
| Port 3000 in use | `npm run dev -- -p 3100` |
| "AI coach is not configured" | Add `GEMINI_API_KEY` to `.env.local` and restart the dev server. |
| Sign-in link returns to the login page | Check the Redirect URLs in step 6. |
| Strange build errors after switching Node versions | `rm -rf node_modules .next` then `npm ci`. |

## Reset

- Clear guest progress: in browser dev tools, remove the `thinkceo:progress:v1` localStorage key.
- Remove all installed packages: `rm -rf node_modules .next`. Nothing outside the project folder is touched.
