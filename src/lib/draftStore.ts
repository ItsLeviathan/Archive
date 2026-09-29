import { CollectionId } from './types';

// The one unfinished entry a writer has on this device. Saved as they type
// so closing the tab (or losing signal) never costs them their words.

export interface Draft {
  title: string;
  body: string;
  collection: CollectionId | null;
}

const KEY = 'unsent-archive:draft';

export function loadDraft(): Draft | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (typeof d?.body !== 'string' || typeof d?.title !== 'string') return null;
    return { title: d.title, body: d.body, collection: d.collection ?? null };
  } catch {
    return null;
  }
}

export function saveDraft(draft: Draft) {
  try {
    if (!draft.title.trim() && !draft.body.trim()) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {
    // Storage unavailable (private mode, quota) — writing still works, it
    // just won't survive a reload.
  }
}

export function clearDraft() {
  try { window.localStorage.removeItem(KEY); } catch {}
}
