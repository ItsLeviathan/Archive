'use client';

import Link from 'next/link';
import { useUsername } from '@/lib/userPrefsHooks';
import { requestIdentity } from '@/lib/events';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconSearch, IconLogo } from './icons';
import { requestOpenSearch, requestOpenRandom } from '@/lib/events';

export function Nav() {
  const username = useUsername();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const isStory = pathname?.startsWith('/story/');
  const currentStoryId = isStory ? pathname!.split('/')[2] : undefined;

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 30); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${isStory ? 'is-story' : ''}`} aria-label="Primary">
      <Link href="/" className="logo">
        <IconLogo className="logo-mark" aria-hidden="true" />
        <span className="logo-word">unsent archive</span>
      </Link>
      <div className="nav-links">
        <Link href="/explore" className="nav-text-item" data-current={pathname === '/explore' || pathname?.startsWith('/explore/')}>Explore</Link>

        {username && username !== 'Anonymous' ? (
          <button type="button" className="nav-link nav-text-item" onClick={() => requestIdentity()}>
            {username}
          </button>
        ) : null}

        <button
          type="button"
          className="nav-link nav-text-item"
          onClick={() => requestOpenRandom(currentStoryId)}
        >
          Random
        </button>
        <Link href="/write" className="nav-text-item" data-current={pathname === '/write'}>Write</Link>
        <Link href="/keep" className="nav-keep-link" data-current={pathname === '/keep'}>Keep</Link>
        <button
          type="button"
          className="nav-icon-btn nav-search-btn"
          onClick={() => requestOpenSearch()}
          aria-label="Search the archive"
        >
          <IconSearch />
        </button>
      </div>
    </nav>
  );
}