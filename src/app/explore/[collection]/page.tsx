import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listByCollection } from '@/lib/store';
import { collectionById } from '@/lib/data';
import { StoryCard } from '@/components/StoryCard';
import { IconArrowLeft } from '@/components/icons';

// The 8 collection slugs are fixed, but which stories appear inside each
// one is not — it comes from the mutable in-memory store, so this route
// must render fresh every request rather than being cached at build time.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ collection: string }> }
): Promise<Metadata> {
  const { collection } = await params;
  const col = collectionById(collection);
  return { title: col ? `${col.label} — The Unsent Archive` : 'The Unsent Archive' };
}

export default async function CollectionPage(
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  const col = collectionById(collection);
  if (!col) notFound();

  const stories = await listByCollection(collection);

  return (
    <div className="container">
      <Link href="/explore" className="back-link"><IconArrowLeft /> Back to collections</Link>
      <div className="collection-header">
        <span className="eyebrow">Collection</span>
        <h1>{col.label}</h1>
        <p>{col.desc}</p>
      </div>
      {stories.length ? (
        <div className="stories-grid">
          {stories.map((s) => <StoryCard key={s.id} story={s} />)}
        </div>
      ) : (
        <div className="empty-state">
          <p className="em-title">Nothing here yet.</p>
          <p>Be the first to <Link href="/write">leave something</Link> in {col.label.toLowerCase()}.</p>
        </div>
      )}
    </div>
  );
}
