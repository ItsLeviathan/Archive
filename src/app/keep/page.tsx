'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Story } from '@/lib/types';
import { useKeptIds } from '@/lib/userPrefsHooks';
import { StoryCard } from '@/components/StoryCard';

export default function KeepPage() {
  const kept = useKeptIds();
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stories')
      .then((r) => r.json())
      .then((data) => setAllStories(data.stories || []))
      .catch(() => setAllStories([]))
      .finally(() => setLoading(false));
  }, []);

  const keptStories = allStories.filter((s) => kept.has(s.id));

  return (
    <div className="container">
      <div className="keep-header">
        <span className="eyebrow">Your private collection</span>
        <h1>Keep this close</h1>
        <p>{loading ? '\u00a0' : keptStories.length ? 'The stories that stayed with you.' : 'Nothing kept yet.'}</p>
      </div>

      {loading ? null : keptStories.length ? (
        <div className="stories-grid">
          {keptStories.map((s) => <StoryCard key={s.id} story={s} />)}
        </div>
      ) : (
        <div className="empty-state">
          <p className="em-title">Nothing kept yet.</p>
          <p>When a story stays with you, <Link href="/explore">go find one</Link> and keep it close.</p>
        </div>
      )}

      <p className="meta-line" style={{ textAlign: 'center', marginTop: '3rem' }}>
        Kept stories live only in this browser, on this device.
      </p>
    </div>
  );
}
