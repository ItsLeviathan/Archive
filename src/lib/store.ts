import { NewStoryInput, Story } from './types';
import { SEED_STORIES } from './data';

/**
 * In-memory data store.
 *
 * This is intentionally the ONLY place that "owns" story data on the server.
 * It exists so the rest of the app (API routes, pages) never touches raw
 * arrays directly — which makes it a clean seam to swap for a real database.
 *
 * TO GO TO PRODUCTION:
 *   Replace the body of each function below with calls to your database
 *   client (e.g. Prisma + Postgres, or the Supabase JS client). The function
 *   signatures are deliberately async already so callers won't need to change.
 *
 * WHY globalThis INSTEAD OF A PLAIN MODULE-LEVEL VARIABLE:
 *   Next.js compiles each route (every API route, every page) as an
 *   independently bundled module. A plain `let stories = [...]` at module
 *   scope gets its own separate copy inside *each* route's bundle — so an
 *   API route and a page route would silently see different arrays, even
 *   though they're running in the same `next start` process and both
 *   import "the same" store.ts. (This is verified, not theoretical: it's
 *   what caused freshly-published stories to 404 on their own page during
 *   testing, while the list API correctly showed them.) Attaching the data
 *   to `globalThis` sidesteps this, because globalThis is a property of the
 *   shared JS realm, not of any one module's scope.
 *
 * CAVEAT: this is still only process-local memory. It resets on server
 * restart, and on most serverless hosts (Vercel etc.) each function
 * instance — and often each concurrent invocation — gets its own process,
 * so writes from one request may simply not be visible to another. Fine for
 * a prototype and for local development; not durable or consistent enough
 * for production. Swap in a real database before shipping this for real.
 */

declare global {
  var __unsentArchiveStories: Story[] | undefined;
}

function db(): Story[] {
  if (!globalThis.__unsentArchiveStories) {
    globalThis.__unsentArchiveStories = [...SEED_STORIES];
  }
  return globalThis.__unsentArchiveStories;
}

export async function listStories(): Promise<Story[]> {
  return db();
}

export async function getStory(id: string): Promise<Story | undefined> {
  return db().find((s) => s.id === id);
}

export async function listByCollection(collectionId: string): Promise<Story[]> {
  return db().filter((s) => s.collection === collectionId);
}

export async function searchStories(query: string): Promise<Story[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return db()
    .filter((s) => {
      const hay = [s.title, s.excerpt, s.author, s.emotion, s.collection, ...s.body]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    })
    .slice(0, 12);
}

function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 180));
  return `${mins} min read`;
}

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
  const { date, time } = formatNow();
  const paras = input.body
    .trim()
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  const finalBody = paras.length ? paras : [input.body.trim()];
  const firstWords = finalBody[0].split(/\s+/);
  const excerpt =
    firstWords.slice(0, 24).join(' ') + (firstWords.length > 24 ? '\u2026' : '');

  const story: Story = {
    id: 'story-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    collection: input.collection,
    emotion: input.collection.toUpperCase(),
    layout: LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)],
    title: input.title.trim(),
    excerpt,
    author: input.author?.trim() || 'Anonymous',
    date,
    time,
    readingTime: estimateReadingTime(input.body),
    felt: 0,
    body: finalBody,
  };

  globalThis.__unsentArchiveStories = [story, ...db()];
  return story;
}

export async function toggleFelt(id: string, felt: boolean): Promise<Story | undefined> {
  const story = db().find((s) => s.id === id);
  if (!story) return undefined;
  story.felt = Math.max(0, story.felt + (felt ? 1 : -1));
  return story;
}
