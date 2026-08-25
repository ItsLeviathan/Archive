export function metaDots(parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(' \u00b7 ');
}
