import Link from 'next/link';
import { listStories } from '@/lib/store';
import { EntryList } from '@/components/StoryCard';
import { ChapterIndex } from '@/components/ChapterIndex';
import { Pager, parsePage } from '@/components/Pager';
import { RandomButton } from '@/components/RandomButton';
import { IconPen } from '@/components/icons';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 12;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const page = parsePage((await searchParams).page);
  // One extra row tells us whether an "Older entries" page exists.
  const rows = await listStories(PAGE_SIZE + 1, (page - 1) * PAGE_SIZE);
  const stories = rows.slice(0, PAGE_SIZE);
  const hasMore = rows.length > PAGE_SIZE;

  return (
    <div className="container">
      {page === 1 && (
        <section className="cover">
          <p className="hand cover-greeting">Dear stranger,</p>
          <h1 className="cover-title">
            Some words are never spoken. They still deserve somewhere to live.
          </h1>
          <p className="cover-sub">
            A shared diary of the things people couldn&rsquo;t say out loud &mdash;
            left anonymously, kept gently.
          </p>
          <div className="cover-actions">
            <Link href="/write" className="btn-primary"><IconPen /> Write an entry</Link>
            <RandomButton className="btn-ghost">Open a random page</RandomButton>
          </div>
        </section>
      )}

      <div className="with-sidebar">
        <div>
          <div className="list-head">
            <h2 className="list-title">{page === 1 ? 'Latest entries' : 'Older entries'}</h2>
          </div>
          {stories.length ? (
            <EntryList stories={stories} />
          ) : (
            <div className="empty-state">
              <p className="em-title">The pages are still blank.</p>
              <p><Link href="/write">Write the first entry</Link>.</p>
            </div>
          )}
          <Pager basePath="/" page={page} hasMore={hasMore} />
        </div>
        <aside className="sidebar">
          <ChapterIndex />
        </aside>
      </div>
    </div>
  );
}
