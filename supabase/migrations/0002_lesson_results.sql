-- Learn feature: one row per completed lesson quiz.
-- Badges and ranks are derived from existing data, so no other tables are needed.

create table public.lesson_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  lesson_id text not null,
  correct integer not null check (correct >= 0),
  total integer not null check (total > 0 and correct <= total),
  xp integer not null default 0,
  created_at timestamptz not null default now()
);
create index lesson_results_user_idx on public.lesson_results (user_id, created_at);

alter table public.lesson_results enable row level security;

create policy "own lesson results" on public.lesson_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
