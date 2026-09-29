-- The Unsent Archive — complete database setup for a NEW Supabase project.
-- Paste this whole file into the Supabase SQL editor and run it once.
-- Safe to re-run: every statement is idempotent.

-- ------------------------------------------------------------
-- Stories
-- ------------------------------------------------------------
create extension if not exists pg_trgm;

create table if not exists public.stories (
  id            text primary key,
  collection    text not null,
  emotion       text not null,
  layout        text not null,
  title         text not null,
  excerpt       text not null,
  author        text not null default 'Anonymous',
  date          text not null,          -- as the writer's own clock saw it, e.g. 'AUGUST 24, 2026'
  time          text not null,          -- e.g. '5:02 AM'
  reading_time  text not null,
  felt          integer not null default 0,
  body          text[] not null,        -- one entry per paragraph
  search_blob   text not null default '',
  photo_url     text,                   -- optional writer-uploaded photo (see storage bucket below)
  photo_caption text,
  created_at    timestamptz not null default now()
);

-- Newest-first listing (home page, chapter pages)
create index if not exists stories_created_at_idx on public.stories (created_at desc);
create index if not exists stories_collection_created_at_idx on public.stories (collection, created_at desc);
-- Fast ILIKE '%word%' search
create index if not exists stories_search_blob_trgm_idx on public.stories using gin (search_blob gin_trgm_ops);

-- Locked down: RLS on with NO policies, so the public anon key can read or
-- write nothing. The site only talks to the database from its own server
-- routes using the service-role key, which bypasses RLS.
alter table public.stories enable row level security;

-- ------------------------------------------------------------
-- Functions used by src/lib/store.ts
-- ------------------------------------------------------------

-- "I felt this" — atomic, so two simultaneous taps can't lose a count.
create or replace function public.increment_felt(story_id text, delta integer)
returns setof public.stories
language sql
as $$
  update public.stories
     set felt = greatest(0, felt + delta)
   where id = story_id
  returning *;
$$;

-- "Random page" — picked in the database instead of downloading everything.
create or replace function public.random_story(exclude_id text default null)
returns setof public.stories
language sql
stable
as $$
  select * from public.stories
   where exclude_id is null or id <> exclude_id
   order by random()
   limit 1;
$$;

revoke execute on function public.increment_felt(text, integer) from public, anon, authenticated;
revoke execute on function public.random_story(text) from public, anon, authenticated;
grant execute on function public.increment_felt(text, integer) to service_role;
grant execute on function public.random_story(text) to service_role;

-- ------------------------------------------------------------
-- Photo storage (public read; uploads happen server-side only)
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('story-photos', 'story-photos', true, 5242880, array['image/webp'])
on conflict (id) do nothing;

notify pgrst, 'reload schema';
