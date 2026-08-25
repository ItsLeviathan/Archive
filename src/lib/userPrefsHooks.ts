'use client';

import { useSyncExternalStore } from 'react';
import { keptStore, feltStore } from './localSetStore';
import { identityStore } from './identityStore';

export function useUsername(): string {
  return useSyncExternalStore(
    identityStore.subscribe,
    identityStore.getSnapshot,
    identityStore.getServerSnapshot
  );
}

export function useKeptIds(): Set<string> {
  return useSyncExternalStore(keptStore.subscribe, keptStore.getSnapshot, keptStore.getServerSnapshot);
}

export function useFeltIds(): Set<string> {
  return useSyncExternalStore(feltStore.subscribe, feltStore.getSnapshot, feltStore.getServerSnapshot);
}
