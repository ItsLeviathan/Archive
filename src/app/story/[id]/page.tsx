import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStory } from '@/lib/store';
import { collectionById } from '@/lib/data';
import { metaDots } from '@/lib/format';
import { FeltButton } from '@/components/FeltButton';
import { KeepButton } from '@/components/KeepButton';
import { RevealParagraphs } from '@/components/RevealParagraphs';
import { ReadAnotherButton } from '@/components/ReadAnotherButton';
import { IconArrowLeft } from '@/components/icons';

// Stories live in a mutable in-memory store (see lib/store.ts), not behind
// fetch(), so Next's Full Route Cache has no way to know this data changes.
// Without this, a freshly-published story's page — or a stale 404 for one
// requested before it existed — would get cached and served indefinitely.
export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const story = await getStory(id);
  return { title: story ? `${story.title} — The Unsent Archive` : 'The Unsent Archive' };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) notFound();

  const col = collectionById(story.collection);

  return (
    <article className="story-view container">
      <header className="story-head">
        <span className="eyebrow">{story.emotion}</span>
        <h1>{story.title}</h1>
        <p className="story-excerpt">{story.excerpt}</p>
        <div className="story-meta-row meta-line">
          {metaDots([story.author, `${story.date} \u00b7 ${story.time}`, story.readingTime])}
        </div>
        <div className="story-controls">
          <FeltButton id={story.id} initialFelt={story.felt} />
          <KeepButton id={story.id} withLabel />
        </div>
      </header>

      <div className="story-divider" aria-hidden="true" />

      <RevealParagraphs paragraphs={story.body} />

      <footer className="story-foot">
        <Link href={`/explore/${story.collection}`} className="story-foot-link">
          <IconArrowLeft /> More from {col ? col.label : 'this collection'}
        </Link>
        <ReadAnotherButton excludeId={story.id} />
      </footer>
    </article>
  );
}
