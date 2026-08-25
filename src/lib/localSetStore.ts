// A tiny external-store implementation for syncing a Set<string> with
// localStorage, built for React's useSyncExternalStore. This is the
// textbook-correct pattern for "external mutable state" like localStorage:
// no effect-triggered setState, no hydration-mismatch flicker — the hook
// itself resolves server vs. client snapshots.

type Listener = () => void;

function createSetStore(key: string) {
  let snapshot: Set<string> = new Set();
  let hydrated = false;
  const listeners = new Set<Listener>();

  function hydrate() {
    if (hydrated || typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(key);
      const arr = raw ? JSON.parse(raw) : [];
      snapshot = new Set(Array.isArray(arr) ? arr : []);
    } catch {
      snapshot = new Set();
    }
    hydrated = true;
  }

  function persist() {
    try {
      window.localStorage.setItem(key, JSON.stringify([...snapshot]));
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) — the app
      // still works in-memory for this session, it just won't persist.
    }
  }

  function subscribe(listener: Listener) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function getSnapshot() {
    hydrate();
    return snapshot;
  }

  function getServerSnapshot() {
    return snapshot; // always empty on the server — no localStorage there
  }

  /** Toggles membership and returns the new state (true = now present). */
  function toggle(id: string): boolean {
    hydrate();
    const next = new Set(snapshot);
    let result: boolean;
    if (next.has(id)) { next.delete(id); result = false; }
    else { next.add(id); result = true; }
    snapshot = next;
    persist();
    listeners.forEach((l) => l());
    return result;
  }

  return { subscribe, getSnapshot, getServerSnapshot, toggle };
}

export const keptStore = createSetStore('unsent-archive:kept');
export const feltStore = createSetStore('unsent-archive:felt');
