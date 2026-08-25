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
    showToast(nowKept ? 'Kept close.' : 'Removed from Keep.');
  }

  return (
    <button
      type="button"
      className={`keep-btn ${isKept ? 'is-kept' : ''}`}
      onClick={(e) => { e.stopPropagation(); handleClick(); }}
      aria-pressed={isKept}
      aria-label={isKept ? 'Remove from your kept stories' : 'Keep this story close'}
    >
      <IconKeep />
      {withLabel && <span>{isKept ? 'Kept close' : 'Keep this close'}</span>}
    </button>
  );
}
