import { NewStoryInput, Story, CollectionId, CardLayout } from './types';
import { supabase } from './supabaseClient';

/**
 * Persistent data store, backed by Postgres via Supabase.
 *
 * This replaces the earlier in-memory `globalThis` store. Function
 * signatures are unchanged on purpose — every API route and page that
 * calls into this file keeps working without modification.
 *
 * Setup:
 *   1. Run supabase/schema.sql once in the Supabase SQL editor (creates
 *      the `stories` table, the `increment_felt` and `random_story`
 *      functions, and enables RLS with no public policies).
 *   2. Run supabase/seed.sql once to load the original 19 stories.
 *   3. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see
 *      .env.local.example).
 */

interface StoryRow {
  id: string;
  collection: string;
  emotion: string;
  layout: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  time: string;
  reading_time: string;
  felt: number;
  body: string[];
}

const SELECT_COLUMNS =
  'id, collection, emotion, layout, title, excerpt, author, date, time, reading_time, felt, body';

function rowToStory(row: StoryRow): Story {
  return {
    id: row.id,
    collection: row.collection as CollectionId,
    emotion: row.emotion,
    layout: row.layout as CardLayout,
    title: row.title,
    excerpt: row.excerpt,
    author: row.author,
    date: row.date,
    time: row.time,
    readingTime: row.reading_time,
    felt: row.felt,
    body: row.body,
  };
}

const DEFAULT_PAGE_SIZE = 60;
const MAX_PAGE_SIZE = 100;

/** Most recent stories first, paginated — the archive is expected to grow
 * past what any single client should ever fetch in one request. */
export async function listStories(
  limit: number = DEFAULT_PAGE_SIZE,
  offset: number = 0
): Promise<Story[]> {
  const safeLimit = Math.max(1, Math.min(limit, MAX_PAGE_SIZE));
  const safeOffset = Math.max(0, offset);

  const { data, error } = await supabase
    .from('stories')
    .select(SELECT_COLUMNS)
    .order('created_at', { ascending: false })
    .range(safeOffset, safeOffset + safeLimit - 1);

  if (error) throw error;
  return (data || []).map(rowToStory);
}

/** Fetch a specific, known set of story IDs in one round trip — used by
 * Keep, which already knows exactly which IDs it needs and shouldn't have
 * to download the whole archive to filter client-side. */
export async function listStoriesByIds(ids: string[]): Promise<Story[]> {
  const cleanIds = ids.filter(Boolean).slice(0, 200);
  if (!cleanIds.length) return [];

  const { data, error } = await supabase
    .from('stories')
    .select(SELECT_COLUMNS)
    .in('id', cleanIds);

  if (error) throw error;
  return (data || []).map(rowToStory);
}

export async function getStory(id: string): Promise<Story | undefined> {
  const { data, error } = await supabase
    .from('stories')
    .select(SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data ? rowToStory(data as StoryRow) : undefined;
}

export async function listByCollection(
  collectionId: string,
  limit: number = DEFAULT_PAGE_SIZE
): Promise<Story[]> {
  const safeLimit = Math.max(1, Math.min(limit, MAX_PAGE_SIZE));

  const { data, error } = await supabase
    .from('stories')
    .select(SELECT_COLUMNS)
    .eq('collection', collectionId)
    .order('created_at', { ascending: false })
    .limit(safeLimit);

  if (error) throw error;
  return (data || []).map(rowToStory);
}

/** Substring search across title/excerpt/author/emotion/collection/body,
 * same behavior as the old in-memory version — just matched against a
 * precomputed `search_blob` column instead of re-joining fields per call. */
export async function searchStories(query: string, limit = 12): Promise<Story[]> {
  const q = query.trim();
  if (!q) return [];

  const { data, error } = await supabase
    .from('stories')
    .select(SELECT_COLUMNS)
    .ilike('search_blob', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).map(rowToStory);
}

/** One random story via a Postgres function (ORDER BY random() LIMIT 1 on
 * the server), instead of shipping the whole table to the client to pick
 * from — this is the fix for "Open a stranger's heart" getting slower as
 * the archive grows. */
export async function getRandomStory(excludeId?: string): Promise<Story | undefined> {
  const { data, error } = await supabase.rpc('random_story', {
    exclude_id: excludeId ?? null,
  });

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? rowToStory(row as StoryRow) : undefined;
}

/**
 * Fallback formatter — ONLY used if the client didn't send its own local
 * date/time (e.g. JS-disabled clients, or a raw API call). This runs on
 * the server, so without an explicit IANA zone it renders in whatever
 * timezone the server process happens to be in (UTC on most hosts), which
 * will NOT match the writer's local clock. Prefer input.date/input.time
 * whenever they're present — see createStory below.
 */
function formatNow() {
  const d = new Date();
  const date = d
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return { date, time };
}

const LAYOUTS = ['horizontal', 'split', 'minimal', 'typographic', 'small'] as const;

export async function createStory(input: NewStoryInput): Promise<Story> {
  // Prefer the timestamp captured on the writer's own device at the moment
  // they published — that's "the original time" from their point of view.
  // Only fall back to server time if the client genuinely didn't send one.
  const clientDate = input.date?.trim();
  const clientTime = input.time?.trim();
  const { date, time } =
    clientDate && clientTime ? { date: clientDate, time: clientTime } : formatNow();

  const paras = input.body
    .trim()
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const finalBody = paras.length ? paras : [input.body.trim()];
  const firstWords = finalBody[0].split(/\s+/);
  const excerpt =
    firstWords.slice(0, 24).join(' ') + (firstWords.length > 24 ? '\u2026' : '');

  const author = input.author?.trim() || 'Anonymous';
  const emotion = input.collection.toUpperCase();
  const layout = LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
  const id = 'story-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  const searchBlob = [input.title, excerpt, author, emotion, input.collection, ...finalBody]
    .join(' ')
    .toLowerCase();

  const { data, error } = await supabase
    .from('stories')
    .insert({
      id,
      collection: input.collection,
      emotion,
      layout,
      title: input.title.trim(),
      excerpt,
      author,
      date,
      time,
      reading_time: estimateReadingTime(input.body),
      felt: 0,
      body: finalBody,
      search_blob: searchBlob,
    })
    .select(SELECT_COLUMNS)
    .single();

  if (error) throw error;
  return rowToStory(data as StoryRow);
}

function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 180));
  return `${mins} min read`;
}

/** Atomic increment/decrement via a Postgres function, so two people
 * tapping "I felt this" on the same story at the same moment can't clobber
 * each other's count (a real read-then-write in JS could). */
export async function toggleFelt(id: string, felt: boolean): Promise<Story | undefined> {
  const { data, error } = await supabase.rpc('increment_felt', {
    story_id: id,
    delta: felt ? 1 : -1,
  });

  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : data;
  return row ? rowToStory(row as StoryRow) : undefined;
}