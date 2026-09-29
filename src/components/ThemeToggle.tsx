'use client';

import { useSyncExternalStore } from 'react';
import { IconMoon, IconSun } from './icons';

type Theme = 'light' | 'dark';
const KEY = 'unsent-archive:theme';

// Runs inline in <head> (see layout.tsx). Only an explicit choice is
// written to data-theme; with none saved, CSS follows the OS setting.
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

const listeners = new Set<() => void>();

function current(): Theme {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === 'light' || explicit === 'dark') return explicit;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', listener);
  return () => {
    listeners.delete(listener);
    mq.removeEventListener('change', listener);
  };
}

export function ThemeToggle() {
  // null on the server — the icon renders after hydration so it never
  // shows the wrong state for a reader whose OS is in dark mode.
  const theme = useSyncExternalStore<Theme | null>(subscribe, current, () => null);

  function toggle() {
    const next: Theme = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch {}
    listeners.forEach((l) => l());
  }

  const label = theme === 'dark' ? 'Switch to day pages' : 'Switch to night pages';
  return (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={label} title={label}>
      {theme === 'dark' ? <IconSun /> : theme === 'light' ? <IconMoon /> : null}
    </button>
  );
}
