'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKeptIds } from '@/lib/userPrefsHooks';
import { requestOpenSearch, requestOpenRandom } from '@/lib/events';
import { ThemeToggle } from './ThemeToggle';
import { IconSearch, IconLogo, IconPen, IconBook, IconKeep, IconShuffle, IconDiary } from './icons';

function useSection() {
  const pathname = usePathname() ?? '/';
  return {
    pathname,
    isToday: pathname === '/',
    isChapters: pathname.startsWith('/explore'),
    isWrite: pathname === '/write',
    isKept: pathname === '/keep',
    storyId: pathname.startsWith('/story/') ? pathname.split('/')[2] : undefined,
  };
}

export function Nav() {
  const s = useSection();
  const keptCount = useKeptIds().size;

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="logo" aria-label="The Unsent Archive — home">
            <IconLogo className="logo-mark" aria-hidden="true" />
            <span className="logo-word">The Unsent Archive</span>
          </Link>

          <nav className="topnav" aria-label="Primary">
            <Link href="/" aria-current={s.isToday ? 'page' : undefined}>Entries</Link>
            <Link href="/explore" aria-current={s.isChapters ? 'page' : undefined}>Chapters</Link>
            <Link href="/keep" aria-current={s.isKept ? 'page' : undefined}>
              Kept{keptCount > 0 && <span className="count-badge">{keptCount}</span>}
            </Link>
            <button type="button" onClick={() => requestOpenRandom(s.storyId)}>Random page</button>
          </nav>

          <div className="topbar-tools">
            <button type="button" className="search-trigger" onClick={() => requestOpenSearch()} aria-label="Search the diary">
              <IconSearch />
              <span className="search-trigger-text">Search</span>
              <kbd className="search-trigger-kbd">/</kbd>
            </button>
            <ThemeToggle />
            <Link href="/write" className="btn-write" aria-current={s.isWrite ? 'page' : undefined}>
              <IconPen /> <span>Write</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Phones: every primary destination one thumb-tap away, always visible. */}
      <nav className="tabbar" aria-label="Primary (mobile)">
        <Link href="/" aria-current={s.isToday ? 'page' : undefined}>
          <IconDiary /><span>Entries</span>
        </Link>
        <Link href="/explore" aria-current={s.isChapters ? 'page' : undefined}>
          <IconBook /><span>Chapters</span>
        </Link>
        <Link href="/write" className="tab-write" aria-current={s.isWrite ? 'page' : undefined}>
          <IconPen /><span>Write</span>
        </Link>
        <Link href="/keep" aria-current={s.isKept ? 'page' : undefined}>
          <IconKeep /><span>Kept{keptCount > 0 ? ` (${keptCount})` : ''}</span>
        </Link>
        <button type="button" onClick={() => requestOpenRandom(s.storyId)}>
          <IconShuffle /><span>Random</span>
        </button>
      </nav>
    </>
  );
}
