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
 * Works with ZERO setup: if PEXELS_API_KEY isn't set, or the request
 * fails for any reason (bad key, rate limit, network hiccup), this
 * quietly falls back to a deterministic Lorem Picsum image (no key
 * required, same photo every time for a given collection) so the UI
 * never shows a broken image or throws.
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

// Used only when there's no Pexels key (or a call fails) — a fixed seed
// per collection means the fallback photo is at least stable/consistent
// across visits, rather than a different random image every request.
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

// globalThis-backed cache — see the comment block in lib/store.ts for why:
// Next.js bundles routes/pages independently, so a plain module-level
// `const cache = new Map()` would silently get a separate copy per route
// bundle even within one running process.
interface PhotoCacheEntry { photo: AtmosphericPhoto; expiresAt: number }
const CACHE_KEY = '__unsentArchivePhotoCache__';
function getCache(): Map<CollectionId, PhotoCacheEntry> {
  const g = globalThis as unknown as { [CACHE_KEY]?: Map<CollectionId, PhotoCacheEntry> };
  if (!g[CACHE_KEY]) g[CACHE_KEY] = new Map();
  return g[CACHE_KEY]!;
}

const TTL_MS = 60 * 60 * 1000; // 1 hour — comfortably under Pexels' free-tier rate limit
const RETRY_TTL_MS = TTL_MS / 4; // shorter TTL on failure, so a transient error self-heals sooner

function fallbackPhoto(collection: CollectionId): AtmosphericPhoto {
  const seed = FALLBACK_SEEDS[collection];
  return { url: `https://picsum.photos/seed/${seed}/1600/1000`, alt: '' };
}

/** One themed atmospheric photo for a collection, cached for an hour. */
export async function getCollectionPhoto(collection: CollectionId): Promise<AtmosphericPhoto> {
  const cache = getCache();
  const cached = cache.get(collection);
  if (cached && cached.expiresAt > Date.now()) return cached.photo;

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    const photo = fallbackPhoto(collection);
    cache.set(collection, { photo, expiresAt: Date.now() + TTL_MS });
    return photo;
  }

  try {
    const query = QUERIES[collection];
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
      { headers: { Authorization: apiKey }, next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Pexels responded ${res.status}`);

    const data = await res.json();
    const first = data?.photos?.[0];
    if (!first) throw new Error('No results for query');

    const photo: AtmosphericPhoto = {
      url: first.src?.large2x || first.src?.large || first.src?.original,
      alt: first.alt || '',
      credit: { name: first.photographer, url: first.photographer_url },
    };
    cache.set(collection, { photo, expiresAt: Date.now() + TTL_MS });
    return photo;
  } catch {
    // Bad/missing key, rate limit, network hiccup — degrade quietly
    // rather than breaking the page, and retry sooner next time.
    const photo = fallbackPhoto(collection);
    cache.set(collection, { photo, expiresAt: Date.now() + RETRY_TTL_MS });
    return photo;
  }
}