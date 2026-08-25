// Random and Search are singleton overlays rendered once in the root layout.
// Any button anywhere in the tree can ask them to open via a plain DOM
// CustomEvent, instead of threading callbacks through context providers.

export function requestOpenSearch() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('archive:open-search'));
}

export function requestOpenRandom(excludeId?: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('archive:open-random', { detail: { excludeId } }));
}

export function requestIdentity() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('archive:request-identity'));
}