import { CollectionId } from './types';

/**
 * Real atmospheric photography for the archive, sourced from the Pexels
 * API (https://www.pexels.com/api/) — found via the "Photography" section
 * of github.com/public-apis/public-apis. Chosen over Unsplash (requires
 * an OAuth application-review process before production use) and
 * over Pixabay (huge volume but a lot of clipart/illustration noise mixed
 * into results) — Pexels gives an instant `apiKey`, a real photo search,
 * and curated, editorial-feeling stock photography that fits this site's
 * "dark editorial magazine" look better than either alternative.
 *
 * Design brief section 18 ("Photography") calls for imagery like empty
 * bedrooms, rain on windows, handwritten letters, coffee cups, old
 * houses, etc. — so each collection gets its own moody search query
 * instead of one generic keyword.
 *
 * VARIETY: each collection resolves to a pool of ~15 candidate photos
 * (one Pexels search per collection, cached for an hour — 8 collections
 * means at most 8 requests/hour, comfortably under the free-tier rate
 * limit). Individual stories are then assigned a photo *deterministically*
 * from that pool based on a hash of their story id: different stories in
 * the same collection get different (but still thematically matching)
 * photography, while the same story always shows the same photo across
 * visits/reloads rather than flickering to something new each time.
 *
 * Works with ZERO setup: if PEXELS_API_KEY isn't set, or the request
 * fails for any reason (bad key, rate limit, network hiccup), this
 * quietly falls back to a pool of deterministic Lorem Picsum images (no
 * key required) so the UI never shows a broken image or throws.
 */

export interface AtmosphericPhoto {
  url: string;
  alt: string;
  credit?: { name: string; url: string };
}

const QUERIES: Record<CollectionId, string> = {
  unsent: 'handwritten letter dim light',
  longing: 'empty chair window rain',
  remembered: 'old photograph film grain',
  forgiven: 'sunlight through curtains',
  goodbye: 'airport window rain night',
  grateful: 'warm kitchen table evening',
  becoming: 'solitary path fog',
  home: 'family dinner table warm light',
};

// Used only when there's no Pexels key (or every call fails) — fixed
// seeds per collection mean the fallback pool is at least stable across
// restarts, rather than a different random set of placeholder images
// every time.
const FALLBACK_SEEDS: Record<CollectionId, string> = {
  unsent: 'unsent-archive-unsent',
  longing: 'unsent-archive-longing',
  remembered: 'unsent-archive-remembered',
  forgiven: 'unsent-archive-forgiven',
  goodbye: 'unsent-archive-goodbye',
  grateful: 'unsent-archive-grateful',
  becoming: 'unsent-archive-becoming',
  home: 'unsent-archive-home',
};

const POOL_SIZE = 15;

// globalThis-backed cache — see the comment block in lib/store.ts for why:
// Next.js bundles routes/pages independently, so a plain module-level
// `const cache = new Map()` would silently get a separate copy per route
// bundle even within one running process.
interface PhotoPoolCacheEntry { photos: AtmosphericPhoto[]; expiresAt: number }
const CACHE_KEY = '__unsentArchivePhotoPoolCache__';
function getCache(): Map<CollectionId, PhotoPoolCacheEntry> {
  const g = globalThis as unknown as { [CACHE_KEY]?: Map<CollectionId, PhotoPoolCacheEntry> };
  if (!g[CACHE_KEY]) g[CACHE_KEY] = new Map();
  return g[CACHE_KEY]!;
}

const TTL_MS = 60 * 60 * 1000; // 1 hour — comfortably under Pexels' free-tier rate limit
const RETRY_TTL_MS = TTL_MS / 4; // shorter TTL on failure, so a transient error self-heals sooner

function fallbackPool(collection: CollectionId): AtmosphericPhoto[] {
  const seed = FALLBACK_SEEDS[collection];
  return Array.from({ length: POOL_SIZE }, (_, i) => ({
    url: `https://picsum.photos/seed/${seed}-${i}/1600/1000`,
    alt: '',
  }));
}

/** Small deterministic string hash (djb2) — same story id always maps to
 * the same index, so a given story's photo doesn't change on re-render. */
function hashToIndex(id: string, size: number): number {
  let hash = 5381;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 33) ^ id.charCodeAt(i);
  }
  return Math.abs(hash) % size;
}

async function getCollectionPhotoPool(collection: CollectionId): Promise<AtmosphericPhoto[]> {
  const cache = getCache();
  const cached = cache.get(collection);
  if (cached && cached.expiresAt > Date.now()) return cached.photos;

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    const photos = fallbackPool(collection);
    cache.set(collection, { photos, expiresAt: Date.now() + TTL_MS });
    return photos;
  }

  try {
    const query = QUERIES[collection];
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=${POOL_SIZE}`,
      { headers: { Authorization: apiKey }, next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Pexels responded ${res.status}`);

    const data = await res.json();
    const results: AtmosphericPhoto[] = (data?.photos ?? []).map(
      (p: { src?: { large2x?: string; large?: string; original?: string }; alt?: string; photographer?: string; photographer_url?: string }) => ({
        url: p.src?.large2x || p.src?.large || p.src?.original || '',
        alt: p.alt || '',
        credit: { name: p.photographer || '', url: p.photographer_url || '' },
      })
    );
    if (!results.length) throw new Error('No results for query');

    cache.set(collection, { photos: results, expiresAt: Date.now() + TTL_MS });
    return results;
  } catch {
    // Bad/missing key, rate limit, network hiccup — degrade quietly
    // rather than breaking the page, and retry sooner next time.
    const photos = fallbackPool(collection);
    cache.set(collection, { photos, expiresAt: Date.now() + RETRY_TTL_MS });
    return photos;
  }
}

/** One photo for a *specific* story — deterministically chosen from a
 * pool of candidates matching that story's collection, so stories in
 * the same collection don't all show the identical photo. */
export async function getStoryPhoto(storyId: string, collection: CollectionId): Promise<AtmosphericPhoto> {
  const pool = await getCollectionPhotoPool(collection);
  return pool[hashToIndex(storyId, pool.length)];
}

/** A single representative photo for a collection as a whole — used on
 * pages like the collection header, where there's no one story to key
 * off. Always the first (top-ranked) match in that collection's pool. */
export async function getCollectionPhoto(collection: CollectionId): Promise<AtmosphericPhoto> {
  const pool = await getCollectionPhotoPool(collection);
  return pool[0];
}