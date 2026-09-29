import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listByCollection } from '@/lib/store';
import { COLLECTIONS, collectionById } from '@/lib/data';
import { chapterNumeral } from '@/lib/format';
import { EntryList } from '@/components/StoryCard';
import { ChapterIndex } from '@/components/ChapterIndex';
import { Pager, parsePage } from '@/components/Pager';
import { IconArrowLeft } from '@/components/icons';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

export async function generateMetadata(
  { params }: { params: Promise<{ collection: string }> }
): Promise<Metadata> {
  const col = collectionById((await params).collection);
  return { title: col ? `${col.label} — The Unsent Archive` : 'The Unsent Archive' };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { collection } = await params;
  const col = collectionById(collection);
  if (!col) notFound();

  const page = parsePage((await searchParams).page);
  const rows = await listByCollection(col.id, PAGE_SIZE + 1, (page - 1) * PAGE_SIZE);
  const stories = rows.slice(0, PAGE_SIZE);
  const hasMore = rows.length > PAGE_SIZE;
  const index = COLLECTIONS.findIndex((c) => c.id === col.id);

  return (
    <div className="container">
      <header className="page-head">
        <Link href="/explore" className="back-link"><IconArrowLeft /> All chapters</Link>
        <span className="stamp">Chapter {chapterNumeral(index)}</span>
        <h1>{col.label}</h1>
        <p>{col.desc}</p>
      </header>

      <div className="with-sidebar">
        <div>
          {stories.length ? (
            <EntryList stories={stories} />
          ) : (
            <div className="empty-state">
              <p className="em-title">No one has written in this chapter yet.</p>
              <p><Link href={`/write?chapter=${col.id}`}>Be the first to write here</Link>.</p>
            </div>
          )}
          <Pager basePath={`/explore/${col.id}`} page={page} hasMore={hasMore} />
        </div>
        <aside className="sidebar">
          <ChapterIndex current={col.id} />
          <Link href={`/write?chapter=${col.id}`} className="sidebar-cta">
            Write in &ldquo;{col.label}&rdquo; &rarr;
          </Link>
        </aside>
      </div>
    </div>
  );
}
