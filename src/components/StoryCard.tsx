import Link from 'next/link';
import { Story } from '@/lib/types';
import { metaDots } from '@/lib/format';
import { FeltButton } from './FeltButton';
import { KeepButton } from './KeepButton';

// Every layout below uses the "stretched link" pattern: a full-cover <Link>
// as an absolutely-positioned sibling (not an ancestor) of any interactive
// controls. This makes the whole card clickable while keeping Felt/Keep as
// real, independently-clickable <button> elements — nesting a <button>
// inside an <a> is invalid HTML, and critically, a click handler's
// stopPropagation() on the button would NOT stop the anchor's native
// "navigate to href" default action, so Keep/Felt would silently also
// navigate away. Layering avoids the bug entirely instead of patching it.

function CardHitArea({ story }: { story: Story }) {
  return (
    <Link href={`/story/${story.id}`} className="card-hit" aria-label={`Read: ${story.title}`} />
  );
}

export function StoryCard({ story }: { story: Story }) {
  const meta = <span className="meta-line">{metaDots([story.author, story.date])}</span>;
  const eyebrow = <span className="eyebrow">{story.emotion}</span>;

  if (story.layout === 'horizontal') {
    return (
      <article className="card card--horizontal">
        <CardHitArea story={story} />
        <div className="card-side">
          {eyebrow}
          <div className="meta-line" style={{ marginTop: '1.4rem', lineHeight: 1.7 }}>
            {story.author}<br />{story.date}<br />{story.readingTime}
          </div>
        </div>
        <div className="card-main">
          <h3 className="card-title">{story.title}</h3>
          <p className="card-excerpt">{story.excerpt}</p>
          <span className="card-read">Read story &rarr;</span>
        </div>
      </article>
    );
  }

  if (story.layout === 'split') {
    return (
      <article className="card card--split">
        <CardHitArea story={story} />
        <div className="card-quote-panel"><p>&ldquo;{story.excerpt}&rdquo;</p></div>
        <div className="card-body">
          {eyebrow}
          <h3 className="card-title">{story.title}</h3>
          <div className="card-foot" style={{ border: 0, paddingTop: '.4rem', marginTop: '.6rem' }}>
            {meta}
            <span className="card-read">Read &rarr;</span>
          </div>
        </div>
      </article>
    );
  }

  if (story.layout === 'typographic') {
    return (
      <article className="card card--typographic">
        <CardHitArea story={story} />
        {eyebrow}
        <h3 className="card-title">{story.title}</h3>
        <div className="card-foot">
          {meta}
          <span className="card-read">Read &rarr;</span>
        </div>
      </article>
    );
  }

  if (story.layout === 'minimal') {
    return (
      <article className="card card--minimal">
        <CardHitArea story={story} />
        <div>
          {eyebrow}
          <h3 className="card-title">{story.title}</h3>
        </div>
        <div className="card-foot">
          {meta}
          <span className="card-read">Read &rarr;</span>
        </div>
      </article>
    );
  }

  // small (default) — the only variant with inline Felt/Keep controls
  return (
    <article className="card card--small">
      <CardHitArea story={story} />
      <div>
        {eyebrow}
        <h3 className="card-title">{story.title}</h3>
        <p className="card-excerpt">{story.excerpt}</p>
      </div>
      <div className="card-foot">
        {meta}
        <span className="control-row card-controls">
          <FeltButton id={story.id} initialFelt={story.felt} />
          <KeepButton id={story.id} />
        </span>
      </div>
    </article>
  );
}
