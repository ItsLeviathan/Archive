'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Story } from '@/lib/types';
import { useIsClient, useKeptIds } from '@/lib/userPrefsHooks';
import { StoryCard } from '@/components/StoryCard';

export default function KeepPage() {
  const isClient = useIsClient();
  const kept = useKeptIds();
  const idsKey = [...kept].join(',');
  const [fetched, setFetched] = useState<Story[] | null>(null);

  useEffect(() => {
    if (!idsKey) return;
    let cancelled = false;
    // Fetch exactly the kept IDs instead of the whole archive.
    fetch(`/api/stories?ids=${idsKey.split(',').map(encodeURIComponent).join(',')}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setFetched(data.stories || []); })
      .catch(() => { if (!cancelled) setFetched([]); });
    return () => { cancelled = true; };
  }, [idsKey]);

  // Most recently kept first. Filtering by `kept` makes un-keeping a page
  // disappear instantly, without waiting for a refetch.
  const byId = new Map((fetched ?? []).map((s) => [s.id, s]));
  const stories = [...kept].reverse().map((id) => byId.get(id)).filter((s): s is Story => !!s);
  const loading = !isClient || (kept.size > 0 && fetched === null);

  return (
    <div className="container narrow">
      <header className="page-head">
        <span className="stamp">Only on this device</span>
        <h1>Kept pages</h1>
        <p>The entries that stayed with you, bookmarked for later.</p>
      </header>

      {loading ? (
        <p className="loading-line">Finding your bookmarks&hellip;</p>
      ) : stories.length ? (
        <div className="entry-list">
          {stories.map((s) => <StoryCard key={s.id} story={s} showDate />)}
        </div>
      ) : (
        <div className="empty-state">
          <p className="em-title">No kept pages yet.</p>
          <p>
            When an entry stays with you, tap the bookmark on it.{' '}
            <Link href="/">Browse the latest entries</Link>.
          </p>
        </div>
      )}
    </div>
  );
}
