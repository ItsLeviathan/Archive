import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStory } from '@/lib/store';
import { getStoryPhoto } from '@/lib/photos';
import { collectionById } from '@/lib/data';
import { diaryDate } from '@/lib/format';
import { FeltButton } from '@/components/FeltButton';
import { KeepButton } from '@/components/KeepButton';
import { ShareButton } from '@/components/ShareButton';
import { RandomButton } from '@/components/RandomButton';
import { AtmosphericPhoto } from '@/components/AtmosphericPhoto';
import { IconArrowLeft } from '@/components/icons';

// Stories live in Supabase and change at any moment (new entries, felt
// counts); rendering per request keeps a freshly published entry — or a
// stale 404 for one requested before it existed — from being cached.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);
  return {
    title: story ? `${story.title} — The Unsent Archive` : 'The Unsent Archive',
    description: story?.excerpt,
  };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) notFound();

  const col = collectionById(story.collection);
  const photo = await getStoryPhoto(story.id, story.collection);

  return (
    <article className="container reading">
      <Link href={`/explore/${story.collection}`} className="back-link">
        <IconArrowLeft /> {col ? col.label : 'Chapter'}
      </Link>

      <div className="sheet">
        <header className="sheet-head">
          <p className="stamp">
            <time>{diaryDate(story.date)}</time> &middot; {story.time}
          </p>
          <h1>{story.title}</h1>
          <p className="sheet-lead">{story.excerpt}</p>
          <p className="stamp sheet-meta">
            <Link href={`/explore/${story.collection}`} className="tag">{col?.label ?? story.emotion}</Link>
            {story.readingTime}
          </p>
        </header>

        <AtmosphericPhoto photo={photo} />

        <div className="sheet-body">
          {story.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <p className="signature sheet-signature">&mdash; {story.author}</p>
      </div>

      <div className="reading-actions" aria-label="Respond to this entry">
        <FeltButton id={story.id} initialFelt={story.felt} />
        <KeepButton id={story.id} withLabel />
        <ShareButton />
      </div>

      <nav className="reading-next" aria-label="Keep reading">
        <Link href={`/explore/${story.collection}`} className="next-card">
          <span className="stamp">More from this chapter</span>
          <span className="next-title">{col ? col.label : 'This chapter'} &rarr;</span>
        </Link>
        <RandomButton excludeId={story.id} className="next-card" icon={false}>
          <span className="stamp">Turn to</span>
          <span className="next-title">A random page &rarr;</span>
        </RandomButton>
      </nav>
    </article>
  );
}
