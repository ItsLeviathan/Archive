'use client';

import { useKeptIds } from '@/lib/userPrefsHooks';
import { keptStore } from '@/lib/localSetStore';
import { useToast } from '@/contexts/ToastContext';
import { IconKeep } from './icons';

export function KeepButton({ id, withLabel = false }: { id: string; withLabel?: boolean }) {
  const kept = useKeptIds();
  const { showToast } = useToast();
  const isKept = kept.has(id);

  function handleClick() {
    const nowKept = keptStore.toggle(id);
    showToast(nowKept ? 'Bookmarked in your Kept pages.' : 'Removed from Kept.');
  }

  return (
    <button
      type="button"
      className={`chip-btn keep-btn ${isKept ? 'is-on' : ''}`}
      onClick={handleClick}
      aria-pressed={isKept}
      aria-label={isKept ? 'Remove from Kept' : 'Keep this page'}
      title={isKept ? 'Kept' : 'Keep this page'}
    >
      <IconKeep aria-hidden="true" />
      {withLabel && <span>{isKept ? 'Kept' : 'Keep'}</span>}
    </button>
  );
}
