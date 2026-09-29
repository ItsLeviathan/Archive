'use client';

import Link from 'next/link';
import { useUsername } from '@/lib/userPrefsHooks';
import { requestIdentity } from '@/lib/events';

export function Footer() {
  const username = useUsername();
  const named = username && username !== 'Anonymous';

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-tagline">A diary that belongs to everyone.</p>
        <div className="footer-links">
          <Link href="/">Entries</Link>
          <Link href="/explore">Chapters</Link>
          <Link href="/write">Write</Link>
          <Link href="/keep">Kept</Link>
          <button type="button" onClick={() => requestIdentity()}>
            {named ? `Signing as ${username}` : 'Set your name'}
          </button>
        </div>
      </div>
    </footer>
  );
}
