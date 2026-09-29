import Link from 'next/link';
import { Story } from '@/lib/types';
import { collectionById } from '@/lib/data';
import { diaryDate, groupByDate, prettyDate } from '@/lib/format';
import { FeltButton } from './FeltButton';
import { KeepButton } from './KeepButton';

/** One diary entry in a list. `showDate` is for lists that aren't already
 * grouped under a date heading (Kept). */
export function StoryCard({ story, showDate = false }: { story: Story; showDate?: boolean }) {
  const chapter = collectionById(story.collection);
  return (
    <article className="entry">
      <Link href={`/story/${story.id}`} className="card-hit" aria-label={`Read: ${story.title}`} />
      <div className="entry-meta">
        <span className="stamp">{showDate ? `${prettyDate(story.date)} · ${story.time}` : story.time}</span>
        <Link href={`/explore/${story.collection}`} className="tag">{chapter?.label ?? story.emotion}</Link>
      </div>
      <h3 className="entry-title">{story.title}</h3>
      <p className="entry-excerpt">{story.excerpt}</p>
      <div className="entry-foot">
        <span className="signature">&mdash; {story.author}</span>
        <span className="control-row">
          <FeltButton id={story.id} initialFelt={story.felt} />
          <KeepButton id={story.id} />
        </span>
      </div>
    </article>
  );
}

/** Entries grouped under diary-style date headings, newest day first. */
export function EntryList({ stories }: { stories: Story[] }) {
  return (
    <div className="entry-list">
      {groupByDate(stories).map((g) => (
        <section key={g.date} className="day" aria-label={diaryDate(g.date)}>
          <h2 className="day-head"><span>{diaryDate(g.date)}</span></h2>
          {g.stories.map((s) => <StoryCard key={s.id} story={s} />)}
        </section>
      ))}
    </div>
  );
}
