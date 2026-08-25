'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Story } from '@/lib/types';

export function SearchOverlay() {
  const [active, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Story[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setActive(false);
    setQuery('');
    setResults([]);
  }, []);

  useEffect(() => {
    function handleOpen() {
      setActive(true);
      setTimeout(() => inputRef.current?.focus(), 280);
    }
    window.addEventListener('archive:open-search', handleOpen);
    return () => window.removeEventListener('archive:open-search', handleOpen);
  }, []);

  useEffect(() => {
    if (!active) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active, close]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    // Nothing to fetch, and nothing to clear: the render below already
    // shows no results whenever query.trim() === '', regardless of
    // whatever `results` last held.
    if (!q) return;
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/stories?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.stories || []);
      } catch {
        setResults([]);
      }
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return (
    <div className={`search-overlay ${active ? 'is-active' : ''}`} role="dialog" aria-modal="true" aria-label="Search the archive">
      <button className="search-close" onClick={close}>Close &#10005;</button>
      <div className="search-input-wrap">
        <label htmlFor="searchInput" className="visually-hidden">Search the archive</label>
        <input
          ref={inputRef}
          id="searchInput"
          type="text"
          className="search-input"
          placeholder="What are you looking for?"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="search-results">
        {query.trim() === '' ? null : results.length ? (
          results.map((s) => (
            <Link key={s.id} href={`/story/${s.id}`} className="search-result" onClick={close}>
              <span className="sr-title">{s.title}</span>
              <span className="sr-tag">{s.emotion}</span>
            </Link>
          ))
        ) : (
          <p className="search-empty">
            Nothing yet. Try another word &mdash; or{' '}
            <Link href="/write" onClick={close}>write it yourself</Link>.
          </p>
        )}
      </div>
    </div>
  );
}
