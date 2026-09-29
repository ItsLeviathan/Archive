-- Optional writer-uploaded photos on stories.
-- Run once in the Supabase SQL editor BEFORE deploying the code that
-- reads these columns (lib/store.ts selects them on every query).

alter table public.stories
  add column if not exists photo_url text,
  add column if not exists photo_caption text;

-- Public-read bucket. Uploads only ever happen server-side through
-- /api/stories with the service-role key (which bypasses storage RLS), so
-- no insert/update policies are created for anon or authenticated users.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('story-photos', 'story-photos', true, 5242880, array['image/webp'])
on conflict (id) do nothing;
