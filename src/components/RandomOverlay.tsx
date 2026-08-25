'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Story } from '@/lib/types';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function RandomOverlay() {
  const [active, setActive] = useState(false);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function handleOpenRandom(e: Event) {
      const excludeId = (e as CustomEvent<{ excludeId?: string }>).detail?.excludeId;
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      setActive(true);

      let pick: Story | undefined;
      try {
        // The server picks the random story now (a Postgres function),
        // instead of the client downloading the whole archive to choose
        // from — that stopped scaling once there was more than a page of
        // stories.
        const url = excludeId
          ? `/api/stories/random?exclude=${encodeURIComponent(excludeId)}`
          : '/api/stories/random';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          pick = data.story;
        }
      } catch {
        // Network hiccup — just close the overlay without navigating.
      }

      const delay = reduced ? 30 : 900;
      timerRef.current = setTimeout(() => {
        if (pick) router.push(`/story/${pick.id}`);
        setTimeout(() => setActive(false), reduced ? 0 : 260);
      }, delay);
    }

    window.addEventListener('archive:open-random', handleOpenRandom);
    return () => {
      window.removeEventListener('archive:open-random', handleOpenRandom);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);

  return (
    <div className={`random-overlay ${active ? 'is-active' : ''}`} aria-hidden={!active}>
      <p className="random-overlay__text">opening a stranger&rsquo;s heart&hellip;</p>
    </div>
  );
}