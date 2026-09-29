'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Story } from '@/lib/types';
import { COLLECTIONS } from '@/lib/data';
import { prettyDate } from '@/lib/format';
import { IconSearch } from './icons';

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  // Results are tagged with the query they answer, so a stale response
  // never shows "nothing found" for what the reader is typing now.
  const [results, setResults] = useState<{ q: string; stories: Story[] } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults(null);
  }, []);

  useEffect(() => {
    function handleOpen() { setOpen(true); }
    // "/" or Ctrl/⌘+K opens search from anywhere, except while typing.
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      const typing = el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('archive:open-search', handleOpen);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('archive:open-search', handleOpen);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const q = query.trim();
  useEffect(() => {
    if (!q) return;
    let cancelled = false;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stories?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled) setResults({ q, stories: data.stories || [] });
      } catch {
        if (!cancelled) setResults({ q, stories: [] });
      }
    }, 180);
    return () => { cancelled = true; clearTimeout(t); };
  }, [q]);

  const current = results && results.q === q ? results.stories : null;

  return (
    <dialog
      ref={dialogRef}
      className="modal search-modal"
      aria-label="Search the diary"
      onClose={close}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="modal-card search-card">
        <div className="search-field">
          <IconSearch aria-hidden="true" />
          <label htmlFor="searchInput" className="visually-hidden">Search the diary</label>
          <input
            id="searchInput"
            type="search"
            autoFocus
            placeholder="Search titles, words, names…"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="button" className="kbd-btn" onClick={close} aria-label="Close search">Esc</button>
        </div>

        <div className="search-results">
          {!q ? (
            <div className="search-suggest">
              <p className="stamp">Browse a chapter</p>
              <div className="choice-chips">
                {COLLECTIONS.map((c) => (
                  <Link key={c.id} href={`/explore/${c.id}`} className="tag tag-lg" onClick={close}>{c.label}</Link>
                ))}
              </div>
            </div>
          ) : current === null ? (
            <p className="loading-line">Looking through the pages&hellip;</p>
          ) : current.length ? (
            <ul>
              {current.map((s) => (
                <li key={s.id}>
                  <Link href={`/story/${s.id}`} className="search-result" onClick={close}>
                    <span className="stamp">{prettyDate(s.date)} &middot; {s.emotion}</span>
                    <span className="sr-title">{s.title}</span>
                    <span className="sr-excerpt">{s.excerpt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="search-empty">
              No pages mention &ldquo;{q}&rdquo; yet &mdash; maybe{' '}
              <Link href="/write" onClick={close}>you&rsquo;re the one to write it</Link>.
            </p>
          )}
        </div>
      </div>
    </dialog>
  );
}
