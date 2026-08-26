'use client';

import Link from 'next/link';
import { useUsername } from '@/lib/userPrefsHooks';
import { requestIdentity } from '@/lib/events';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconSearch, IconLogo, IconMenu, IconClose } from './icons';
import { requestOpenSearch, requestOpenRandom } from '@/lib/events';

export function Nav() {
  const username = useUsername();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isStory = pathname?.startsWith('/story/');
  const currentStoryId = isStory ? pathname!.split('/')[2] : undefined;

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 30); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation, and stop the page behind it from
  // scrolling while it's open — otherwise a long story page keeps scrolling
  // underneath the full-screen menu on iOS/Android.
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  function openRandomFromMenu() {
    setMenuOpen(false);
    requestOpenRandom(currentStoryId);
  }

  return (
    <>
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
          {/* Only visible at the mobile breakpoint (see globals.css) — this is
              the replacement for Explore/Random/Write once they're hidden
              from the bar above, so nothing becomes unreachable on a phone. */}
          <button
            type="button"
            className="nav-icon-btn nav-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <IconMenu />
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu ${menuOpen ? 'is-active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
      >
        <button type="button" className="mobile-menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">
          <IconClose />
        </button>
        <nav className="mobile-menu-links" aria-label="Mobile">
          <Link href="/explore" data-current={pathname === '/explore' || pathname?.startsWith('/explore/')}>
            Explore
          </Link>
          <button type="button" onClick={openRandomFromMenu}>Random</button>
          <Link href="/write" data-current={pathname === '/write'}>Write</Link>
          <Link href="/keep" data-current={pathname === '/keep'}>Keep</Link>
        </nav>
        <button type="button" className="mobile-menu-identity" onClick={() => { setMenuOpen(false); requestIdentity(); }}>
          {username && username !== 'Anonymous' ? `Writing as ${username}` : 'Set your name'}
        </button>
      </div>
    </>
  );
}