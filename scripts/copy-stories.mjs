// One-off: copy every story from the OLD Supabase project into the NEW one.
//
//   node scripts/copy-stories.mjs           -> dry run: counts only, writes nothing
//   node scripts/copy-stories.mjs --write   -> actually copies
//
// Reads .env.local:
//   OLD_SUPABASE_URL / OLD_SUPABASE_SERVICE_ROLE_KEY   source (read-only)
//   SUPABASE_URL     / SUPABASE_SERVICE_ROLE_KEY       destination
// The source is only ever SELECTed from. Re-running is safe: rows are
// upserted by id, and original created_at is kept so ordering is preserved.

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const need = ['OLD_SUPABASE_URL', 'OLD_SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.error(`Missing in .env.local: ${missing.join(', ')}`);
  process.exit(1);
}
if (env.OLD_SUPABASE_URL === env.SUPABASE_URL) {
  console.error('OLD_SUPABASE_URL and SUPABASE_URL are the same project — nothing to copy.');
  process.exit(1);
}

const write = process.argv.includes('--write');
const opts = { auth: { persistSession: false } };
const source = createClient(env.OLD_SUPABASE_URL, env.OLD_SUPABASE_SERVICE_ROLE_KEY, opts);
const dest = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, opts);

const COLUMNS =
  'id, collection, emotion, layout, title, excerpt, author, date, time, reading_time, felt, body, search_blob, created_at';

async function main() {
  const { data: rows, error } = await source.from('stories').select(COLUMNS).order('created_at');
  if (error) {
    console.error('Could not read from the old project:', error.message);
    return 1;
  }
  console.log(`Old project (${new URL(env.OLD_SUPABASE_URL).hostname}): ${rows.length} stories`);

  const { count, error: destError } = await dest.from('stories').select('id', { count: 'exact', head: true });
  if (destError) {
    console.error('Could not read the new project — did you run supabase/schema.sql there?', destError.message);
    return 1;
  }
  console.log(`New project (${new URL(env.SUPABASE_URL).hostname}): ${count} stories before copy`);

  if (!write) {
    console.log('\nDry run — nothing written. Re-run with --write to copy.');
    return 0;
  }

  const { error: upsertError } = await dest.from('stories').upsert(rows, { onConflict: 'id' });
  if (upsertError) {
    console.error('Copy failed:', upsertError.message);
    return 1;
  }
  const { count: after } = await dest.from('stories').select('id', { count: 'exact', head: true });
  console.log(`Done. New project now has ${after} stories.`);
  return 0;
}

process.exitCode = await main();
