import Link from 'next/link';
import { Story } from '@/lib/types';
import { metaDots } from '@/lib/format';
import { FeltButton } from './FeltButton';
import { KeepButton } from './KeepButton';


function CardHitArea({ story }: { story: Story }) {
  return (
    <Link href={`/story/${story.id}`} className="card-hit" aria-label={`Read: ${story.title}`} />
  );
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="story-row">
      <CardHitArea story={story} />
      <div className="story-row-top">
        <span className="eyebrow">{story.emotion}</span>
        <span className="meta-line">{metaDots([story.author, story.date])}</span>
      </div>
      <h3 className="story-row-title">{story.title}</h3>
      <p className="story-row-excerpt">{story.excerpt}</p>
      <div className="story-row-foot">
        <span className="control-row">
          <FeltButton id={story.id} initialFelt={story.felt} />
          <KeepButton id={story.id} />
        </span>
        <span className="story-row-read">Read &rarr;</span>
      </div>
    </article>
  );
}