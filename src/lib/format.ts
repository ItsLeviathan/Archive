import { Story } from './types';

export function metaDots(parts: (string | undefined | null)[]): string {
  return parts.filter(Boolean).join(' · ');
}

// Stories store their date as the writer saw it ("AUGUST 24, 2026"), not a
// timestamp. Parsing that string gives local midnight of that calendar day,
// so the weekday below is the same on server and client regardless of zone.
function parseStoryDate(date: string): Date | null {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "AUGUST 24, 2026" → "August 24, 2026" */
export function prettyDate(date: string): string {
  const d = parseStoryDate(date);
  if (!d) return date;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/** "AUGUST 24, 2026" → "Monday, August 24, 2026" — a diary page heading. */
export function diaryDate(date: string): string {
  const d = parseStoryDate(date);
  if (!d) return date;
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

/** Groups consecutive stories that share a date, preserving order. The
 * store already returns newest-first, so this yields one group per day. */
export function groupByDate(stories: Story[]): { date: string; stories: Story[] }[] {
  const groups: { date: string; stories: Story[] }[] = [];
  for (const s of stories) {
    const last = groups[groups.length - 1];
    if (last && last.date === s.date) last.stories.push(s);
    else groups.push({ date: s.date, stories: [s] });
  }
  return groups;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export function chapterNumeral(index: number): string {
  return ROMAN[index] ?? String(index + 1);
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

