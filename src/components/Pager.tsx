import Link from 'next/link';
import { IconArrowLeft, IconArrowRight } from './icons';

/** Newer / older page links for a paginated entry list. */
export function Pager({ basePath, page, hasMore }: { basePath: string; page: number; hasMore: boolean }) {
  if (page <= 1 && !hasMore) return null;
  const href = (p: number) => (p <= 1 ? basePath : `${basePath}?page=${p}`);
  return (
    <nav className="pager" aria-label="Pages">
      {page > 1 ? (
        <Link href={href(page - 1)} className="pager-link"><IconArrowLeft /> Newer entries</Link>
      ) : <span />}
      <span className="stamp">Page {page}</span>
      {hasMore ? (
        <Link href={href(page + 1)} className="pager-link">Older entries <IconArrowRight /></Link>
      ) : <span />}
    </nav>
  );
}

export function parsePage(raw: string | string[] | undefined): number {
  const n = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(n) && n > 1 ? n : 1;
}
