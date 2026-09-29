'use client';

import { useToast } from '@/contexts/ToastContext';
import { IconLink } from './icons';

/** Uses the native share sheet on phones, otherwise copies the link. */
export function ShareButton() {
  const { showToast } = useToast();

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied.');
    } catch {
      showToast('Couldn’t copy the link.');
    }
  }

  return (
    <button type="button" className="chip-btn" onClick={share}>
      <IconLink aria-hidden="true" /> <span>Share</span>
    </button>
  );
}
