'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { COLLECTIONS } from '@/lib/data';
import { CollectionId } from '@/lib/types';
import { metaDots } from '@/lib/format';
import { useToast } from '@/contexts/ToastContext';

type NameChoice = 'anon' | 'named' | null;

export function WriteFlow() {
  const router = useRouter();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  const [collection, setCollection] = useState<CollectionId | null>(null);
  const [nameChoice, setNameChoice] = useState<NameChoice>(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canContinue = useMemo(() => {
    if (step === 1) return body.trim().length >= 3;
    if (step === 2) return title.trim().length >= 2;
    if (step === 3) return !!collection;
    if (step === 4) return !!nameChoice && !(nameChoice === 'named' && !name.trim());
    return true;
  }, [step, body, title, collection, nameChoice, name]);

  function next() { setError(null); setStep((s) => Math.min(5, s + 1)); }
  function back() {
    setError(null);
    if (step === 1) { router.push('/'); return; }
    setStep((s) => s - 1);
  }

  async function publish() {
    if (!collection) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          collection,
          author: nameChoice === 'named' ? name : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      router.push(`/story/${data.story.id}`);
      setTimeout(() => showToast('Your words found a home in the archive.'), 420);
    } catch {
      setError('Could not reach the archive. Check your connection and try again.');
      setSubmitting(false);
    }
  }

  function saveDraft() {
    showToast('Draft saved. It stays right here for now.');
  }

  const dots = [1, 2, 3, 4].map((n) => (
    <span key={n} className={`dot ${n === step ? 'is-active' : n < step ? 'is-done' : ''}`} />
  ));

  const col = collection ? COLLECTIONS.find((c) => c.id === collection) : undefined;
  const wordsForExcerpt = body.trim().split(/\s+/).filter(Boolean);
  const excerptPreview =
    wordsForExcerpt.slice(0, 22).join(' ') + (wordsForExcerpt.length > 22 ? '\u2026' : '');
  const authorDisplay = nameChoice === 'named' && name.trim() ? name.trim() : 'Anonymous';

  return (
    <>
      {step <= 4 && <div className="write-progress">{dots}</div>}
      <div className="write-view">
        <div className="write-step">
          {step === 1 && (
            <>
              <p className="write-prompt">What have you been carrying?</p>
              <label htmlFor="writeBody" className="visually-hidden">Your story</label>
              <textarea
                id="writeBody"
                className="write-textarea"
                placeholder="Start anywhere. There is no wrong sentence."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                autoFocus
              />
              <div className="write-nav-row">
                <button type="button" className="btn-ghost" onClick={() => router.push('/')}>Cancel</button>
                <button type="button" className="btn-primary" disabled={!canContinue} onClick={next}>Continue</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="write-prompt">If this feeling had a title, what would it be?</p>
              <label htmlFor="writeTitle" className="visually-hidden">Story title</label>
              <input
                id="writeTitle"
                type="text"
                className="write-input"
                placeholder="The last voicemail I never deleted."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <p className="write-hint">One line is enough.</p>
              <div className="write-nav-row">
                <button type="button" className="btn-ghost" onClick={back}>Back</button>
                <button type="button" className="btn-primary" disabled={!canContinue} onClick={next}>Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="write-prompt">What does this belong to?</p>
              <div className="write-chips">
                {COLLECTIONS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`write-chip ${collection === c.id ? 'is-selected' : ''}`}
                    onClick={() => setCollection(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="write-nav-row">
                <button type="button" className="btn-ghost" onClick={back}>Back</button>
                <button type="button" className="btn-primary" disabled={!canContinue} onClick={next}>Continue</button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <p className="write-prompt">Do you want your name attached?</p>
              <div className="write-choice-row">
                <button
                  type="button"
                  className={`write-choice ${nameChoice === 'anon' ? 'is-selected' : ''}`}
                  onClick={() => { setNameChoice('anon'); setName(''); }}
                >
                  Anonymous
                </button>
                <button
                  type="button"
                  className={`write-choice ${nameChoice === 'named' ? 'is-selected' : ''}`}
                  onClick={() => setNameChoice('named')}
                >
                  Use my name
                </button>
              </div>
              {nameChoice === 'named' && (
                <>
                  <label htmlFor="writeName" className="visually-hidden">Your name</label>
                  <input
                    id="writeName"
                    type="text"
                    className="write-name-input"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                  />
                </>
              )}
              <div className="write-nav-row">
                <button type="button" className="btn-ghost" onClick={back}>Back</button>
                <button type="button" className="btn-primary" disabled={!canContinue} onClick={next}>Continue</button>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <p className="write-prompt" style={{ fontSize: '1.4rem', marginBottom: '1.6rem' }}>
                One last look before it leaves you.
              </p>
              <div className="write-preview">
                <span className="eyebrow">{col ? col.label.toUpperCase() : ''}</span>
                <h3>{title}</h3>
                <p className="wp-excerpt">{excerptPreview}</p>
                <div className="wp-meta meta-line">{metaDots([authorDisplay, 'Today'])}</div>
              </div>
              {error && <p className="write-error">{error}</p>}
              <div className="write-nav-row" style={{ flexDirection: 'column', gap: '1rem' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={publish}
                  disabled={submitting}
                >
                  {submitting ? 'Leaving it here\u2026' : 'Leave it here.'}
                </button>
                <div style={{ display: 'flex', gap: '1.6rem' }}>
                  <button type="button" className="btn-ghost" onClick={back}>Back</button>
                  <button type="button" className="btn-ghost" onClick={saveDraft}>Save draft</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
