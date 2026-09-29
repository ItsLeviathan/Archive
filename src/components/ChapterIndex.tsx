import Link from 'next/link';
import { COLLECTIONS } from '@/lib/data';
import { chapterNumeral } from '@/lib/format';

/** The diary's table of contents — the sidebar on list pages. */
export function ChapterIndex({ current }: { current?: string }) {
  return (
    <nav className="toc" aria-label="Chapters">
      <p className="toc-title">Chapters</p>
      <ol>
        {COLLECTIONS.map((c, i) => (
          <li key={c.id}>
            <Link href={`/explore/${c.id}`} aria-current={current === c.id ? 'page' : undefined}>
              <span className="toc-num">{chapterNumeral(i)}</span>
              <span className="toc-label">{c.label}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
