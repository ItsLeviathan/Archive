'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLLECTIONS } from '@/lib/data';
import { CollectionId } from '@/lib/types';
import { useIsClient } from '@/lib/userPrefsHooks';
import { identityStore } from '@/lib/identityStore';
import { loadDraft, saveDraft, clearDraft } from '@/lib/draftStore';
import { useToast } from '@/contexts/ToastContext';

// Computed in the browser so it reflects the writer's own clock and
// timezone. Server time (usually UTC) would stamp the entry with the wrong
// day/hour — see NewStoryInput in lib/types.ts.
function formatLocalNow() {
  const d = new Date();
  const date = d
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    .toUpperCase();
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const heading = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return { date, time, heading };
}

function isCollectionId(v: string | undefined): v is CollectionId {
  return !!v && COLLECTIONS.some((c) => c.id === v);
}

/** The composer reads its draft and saved name from localStorage in its
 * first render, so it mounts only in the browser. */
export function WriteFlow({ initialChapter }: { initialChapter?: string }) {
  const isClient = useIsClient();
  if (!isClient) return <div className="container write" aria-busy="true" />;
  return <Composer initialChapter={isCollectionId(initialChapter) ? initialChapter : null} />;
}

function Composer({ initialChapter }: { initialChapter: CollectionId | null }) {
  const router = useRouter();
  const { showToast } = useToast();

  const [draft] = useState(loadDraft);
  const [restored, setRestored] = useState(() => !!draft);
  const [title, setTitle] = useState(draft?.title ?? '');
  const [body, setBody] = useState(draft?.body ?? '');
  const [collection, setCollection] = useState<CollectionId | null>(initialChapter ?? draft?.collection ?? null);

  const [storedName] = useState(() => identityStore.getSnapshot());
  const hasStoredName = !!storedName && storedName !== 'Anonymous';
  const [signAs, setSignAs] = useState<'anon' | 'named'>(hasStoredName ? 'named' : 'anon');
  const [name, setName] = useState(hasStoredName ? storedName : '');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [{ heading }] = useState(formatLocalNow);

  // Save as they type — a closed tab never costs anyone their words.
  useEffect(() => { saveDraft({ title, body, collection }); }, [title, body, collection]);

  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const missing = [
    body.trim().length < 3 && 'write a few words',
    title.trim().length < 2 && 'add a title',
    !collection && 'pick a chapter',
    signAs === 'named' && !name.trim() && 'enter your name',
  ].filter(Boolean) as string[];
  const ready = missing.length === 0;

  function discard() {
    if (!window.confirm('Throw away this draft? This can’t be undone.')) return;
    clearDraft();
    setTitle(''); setBody(''); setCollection(initialChapter); setRestored(false);
  }

  async function publish() {
    if (!ready || !collection || submitting) return;
    setSubmitting(true);
    setError(null);
    const { date, time } = formatLocalNow();
    const author = signAs === 'named' ? name.trim() : undefined;
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, collection, author, date, time }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      clearDraft();
      if (author) identityStore.set(author);
      router.push(`/story/${data.story.id}`);
      showToast('Your words found a home in the archive.');
    } catch {
      setError('Could not reach the archive. Your draft is safe — try again in a moment.');
      setSubmitting(false);
    }
  }

  return (
    <div className="container write">
      <header className="write-head">
        <p className="stamp">{heading}</p>
        <p className="hand write-greeting">Dear diary,</p>
      </header>

      {restored && (
        <p className="notice">
          We kept your unfinished entry from last time.{' '}
          <button type="button" className="link-btn" onClick={discard}>Start over</button>
        </p>
      )}

      <form
        className="sheet sheet-write"
        onSubmit={(e) => { e.preventDefault(); publish(); }}
        onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); publish(); } }}
      >
        <label htmlFor="writeTitle" className="visually-hidden">Title</label>
        <input
          id="writeTitle"
          className="write-title"
          placeholder="Give it a title…"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="writeBody" className="visually-hidden">Your entry</label>
        <textarea
          id="writeBody"
          className="write-body"
          placeholder="What have you been carrying? Start anywhere — there is no wrong sentence. Leave a blank line between paragraphs."
          value={body}
          maxLength={20000}
          onChange={(e) => setBody(e.target.value)}
          autoFocus
        />
        <p className="write-status stamp" aria-live="polite">
          {words} {words === 1 ? 'word' : 'words'} &middot; ~{Math.max(1, Math.round(words / 180))} min read
          {(title || body) && <> &middot; draft saved on this device</>}
        </p>

        <fieldset className="write-field">
          <legend>Which chapter does it belong to?</legend>
          <div className="choice-chips">
            {COLLECTIONS.map((c) => (
              <label key={c.id} className="choice-chip" title={c.desc}>
                <input
                  type="radio"
                  name="chapter"
                  value={c.id}
                  checked={collection === c.id}
                  onChange={() => setCollection(c.id)}
                />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
          {collection && (
            <p className="field-hint">{COLLECTIONS.find((c) => c.id === collection)?.desc}</p>
          )}
        </fieldset>

        <fieldset className="write-field">
          <legend>Sign it as</legend>
          <div className="choice-chips">
            <label className="choice-chip">
              <input type="radio" name="signAs" checked={signAs === 'anon'} onChange={() => setSignAs('anon')} />
              <span>Anonymous</span>
            </label>
            <label className="choice-chip">
              <input type="radio" name="signAs" checked={signAs === 'named'} onChange={() => setSignAs('named')} />
              <span>My name</span>
            </label>
            {signAs === 'named' && (
              <>
                <label htmlFor="writeName" className="visually-hidden">Your name</label>
                <input
                  id="writeName"
                  className="field field-inline"
                  placeholder="Your name"
                  value={name}
                  maxLength={60}
                  onChange={(e) => setName(e.target.value)}
                />
              </>
            )}
          </div>
        </fieldset>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="write-actions">
          <p className="field-hint">
            {ready
              ? 'Once it’s left here, it can’t be edited. Ctrl/⌘ + Enter to publish.'
              : `To publish: ${missing.join(', ')}.`}
          </p>
          <div className="write-buttons">
            {(title || body) && (
              <button type="button" className="btn-ghost" onClick={discard}>Discard</button>
            )}
            <button type="submit" className="btn-primary" disabled={!ready || submitting}>
              {submitting ? 'Leaving it here…' : 'Leave it in the archive'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
