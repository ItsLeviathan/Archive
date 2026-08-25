type Listener = () => void;

function createIdentityStore(key: string) {
  let snapshot = '';
  let hydrated = false;
  const listeners = new Set<Listener>();

  function hydrate() {
    if (hydrated || typeof window === 'undefined') return;
    try { snapshot = window.localStorage.getItem(key) || ''; }
    catch { snapshot = ''; }
    hydrated = true;
  }
  function persist() {
    try { window.localStorage.setItem(key, snapshot); } catch {}
  }
  function subscribe(listener: Listener) {
    hydrate();
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
  function getSnapshot() { hydrate(); return snapshot; }
  function getServerSnapshot() { return ''; }
  function set(name: string) {
    hydrate();
    snapshot = name.trim();
    persist();
    listeners.forEach((l) => l());
  }
  function clear() {
    snapshot = '';
    persist();
    listeners.forEach((l) => l());
  }

  return { subscribe, getSnapshot, getServerSnapshot, set, clear };
}

export const identityStore = createIdentityStore('unsent-archive:username');