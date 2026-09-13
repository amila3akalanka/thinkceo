-- ThinkCEO initial schema. Run in the Supabase SQL editor or with `supabase db push`.
-- Scenario content lives in the repo (content/scenarios.ts), so only user data is stored here.

create table public.profiles (
  user_id uuid primary key references auth.users on delete cascade,
  archetype text,
  xp integer not null default 0,
  streak integer not null default 0,
  last_active date,
  updated_at timestamptz not null default now()
);

create table public.assessment_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  scores jsonb not null,
  archetype text not null,
  created_at timestamptz not null default now()
);
create index assessment_results_user_idx on public.assessment_results (user_id, created_at desc);

create table public.learning_paths (
  user_id uuid primary key references auth.users on delete cascade,
  modules jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  scenario_id text not null,
  option_id text not null,
  score integer not null check (score between 0 and 100),
  confidence integer not null check (confidence between 0 and 100),
  xp integer not null default 0,
  created_at timestamptz not null default now()
);
create index attempts_user_idx on public.attempts (user_id, created_at);

-- Row level security: every user can only see and change their own rows.
alter table public.profiles enable row level security;
alter table public.assessment_results enable row level security;
alter table public.learning_paths enable row level security;
alter table public.attempts enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own assessments" on public.assessment_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own path" on public.learning_paths
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own attempts" on public.attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
