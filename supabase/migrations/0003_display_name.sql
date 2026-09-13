-- Display name chosen by the user at sign-up or in Profile.
alter table public.profiles
  add column if not exists display_name text
  check (display_name is null or char_length(display_name) between 1 and 40);
