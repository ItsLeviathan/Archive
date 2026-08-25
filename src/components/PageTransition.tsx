'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const TRANSITION_MS = 420;

export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [exiting, setExiting] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Once the new route's content actually arrives, swap it in and fade it up.
  useEffect(() => {
    setDisplayChildren(children);
    setExiting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Intercept every internal link click so we can play the exit
  // animation BEFORE telling Next.js to navigate — otherwise Next swaps
  // the DOM instantly and there's nothing left to animate.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http') || anchor.target === '_blank') return;
      if (href === pathname) return;

      e.preventDefault();
      const delay = reducedRef.current ? 0 : TRANSITION_MS;
      setExiting(true);
      setTimeout(() => router.push(href), delay);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router, pathname]);

  return (
    <div
      style={{
        opacity: exiting ? 0 : 1,
        filter: exiting ? 'blur(8px)' : 'blur(0px)',
        transform: exiting ? 'translateY(10px) scale(0.985)' : 'translateY(0) scale(1)',
        transition: `opacity ${TRANSITION_MS}ms cubic-bezier(.22,.61,.36,1), filter ${TRANSITION_MS}ms cubic-bezier(.22,.61,.36,1), transform ${TRANSITION_MS}ms cubic-bezier(.22,.61,.36,1)`,
        willChange: 'opacity, filter, transform',
      }}
    >
      {displayChildren}
    </div>
  );
}