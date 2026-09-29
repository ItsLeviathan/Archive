'use client';

import { useState, useTransition } from 'react';
import { useFeltIds } from '@/lib/userPrefsHooks';
import { feltStore } from '@/lib/localSetStore';
import { IconHeart } from './icons';

export function FeltButton({ id, initialFelt }: { id: string; initialFelt: number }) {
  const felt = useFeltIds();
  const [count, setCount] = useState(initialFelt);
  const [, startTransition] = useTransition();
  const isFelt = felt.has(id);

  function handleClick() {
    const nowFelt = feltStore.toggle(id);
    setCount((c) => c + (nowFelt ? 1 : -1));
    startTransition(() => {
      fetch(`/api/stories/${id}/felt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ felt: nowFelt }),
      }).catch(() => {
        // Non-fatal: the local toggle already reflects intent; a failed
        // network call just means the shared count won't update this time.
      });
    });
  }

  return (
    <button
      type="button"
      className={`chip-btn felt-btn ${isFelt ? 'is-on' : ''}`}
      onClick={handleClick}
      aria-pressed={isFelt}
      aria-label={`I felt this — ${count} ${count === 1 ? 'person' : 'people'} felt it`}
      title="I felt this"
    >
      <IconHeart aria-hidden="true" />
      <span>{count}</span>
    </button>
  );
}
