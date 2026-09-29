'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

export function RandomOverlay() {
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    async function handleOpenRandom(e: Event) {
      const excludeId = (e as CustomEvent<{ excludeId?: string }>).detail?.excludeId;
      setActive(true);
      try {
        const url = excludeId
          ? `/api/stories/random?exclude=${encodeURIComponent(excludeId)}`
          : '/api/stories/random';
        const res = await fetch(url);
        const data = res.ok ? await res.json() : null;
        if (data?.story) router.push(`/story/${data.story.id}`);
        else showToast('No other pages to turn to yet.');
      } catch {
        showToast('Couldn’t reach the archive. Try again in a moment.');
      } finally {
        // Brief, just long enough to read as a page turning — not a wait.
        setTimeout(() => setActive(false), 350);
      }
    }

    window.addEventListener('archive:open-random', handleOpenRandom);
    return () => window.removeEventListener('archive:open-random', handleOpenRandom);
  }, [router, showToast]);

  return (
    <div className={`random-overlay ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <p className="hand">turning to a random page&hellip;</p>
    </div>
  );
}
