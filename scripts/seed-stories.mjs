// Load the 19 built-in sample stories (SEED_STORIES in src/lib/data.ts)
// into the database named by SUPABASE_URL in .env.local.
//
//   node scripts/seed-stories.mjs           -> dry run: shows what would be added
//   node scripts/seed-stories.mjs --write   -> inserts them
//
// Safe to re-run: stories are upserted by id, so nothing is duplicated.

import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const root = new URL('..', import.meta.url);
const env = Object.fromEntries(
  readFileSync(new URL('.env.local', root), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trimStart().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

// data.ts is TypeScript; Node can run it directly once its type-only
// import line is removed (Node strips the remaining type annotations).
const source = readFileSync(new URL('src/lib/data.ts', root), 'utf8').replace(/^import .*\n/m, '');
const tmp = join(tmpdir(), `unsent-seed-${Date.now()}.ts`);
writeFileSync(tmp, source);
const { SEED_STORIES } = await import(pathToFileURL(tmp).href).finally(() => rmSync(tmp, { force: true }));

// Stories are listed newest-first by created_at, so derive it from each
// story's own date/time rather than stamping them all "now".
function createdAt(s) {
  const d = new Date(`${s.date} ${s.time}`);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

const rows = SEED_STORIES.map((s) => ({
  id: s.id,
  collection: s.collection,
  emotion: s.emotion,
  layout: s.layout,
  title: s.title,
  excerpt: s.excerpt,
  author: s.author,
  date: s.date,
  time: s.time,
  reading_time: s.readingTime,
  felt: s.felt,
  body: s.body,
  // Same recipe as createStory() in src/lib/store.ts
  search_blob: [s.title, s.excerpt, s.author, s.emotion, s.collection, ...s.body].join(' ').toLowerCase(),
  created_at: createdAt(s),
}));

async function main() {
  const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const host = new URL(env.SUPABASE_URL).hostname;

  const { count, error } = await db.from('stories').select('id', { count: 'exact', head: true });
  if (error) {
    console.error(`Can't read the stories table on ${host} — has supabase/schema.sql been run there?\n  ${error.message}`);
    return 1;
  }
  console.log(`${host}: ${count} stories now; ${rows.length} sample stories to add.`);

  if (!process.argv.includes('--write')) {
    console.log('Dry run — nothing written. Re-run with --write to add them.');
    return 0;
  }

  const { error: upsertError } = await db.from('stories').upsert(rows, { onConflict: 'id' });
  if (upsertError) {
    console.error('Seeding failed:', upsertError.message);
    return 1;
  }
  const { count: after } = await db.from('stories').select('id', { count: 'exact', head: true });
  console.log(`Done. ${host} now has ${after} stories.`);
  return 0;
}

process.exitCode = await main();
