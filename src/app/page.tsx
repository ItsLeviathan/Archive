import Link from 'next/link';
import { listStories } from '@/lib/store';
import { COLLECTIONS } from '@/lib/data';
import { metaDots } from '@/lib/format';
import { StoryCard } from '@/components/StoryCard';
import { CollectionTile } from '@/components/CollectionTile';
import { RandomSeal } from '@/components/RandomSeal';
import { IconArrowRight } from '@/components/icons';

// Reads the live in-memory store — must render fresh, not be cached at build time.
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const stories = await listStories();
  const hero = stories[0];
  const featured = stories.slice(1, 9);

  return (
    <>
      <section className="hero">
        <Link href={`/story/${hero.id}`} className="hero-card" aria-label={`Read: ${hero.title}`}>
          <span className="eyebrow hero-eyebrow">The Unsent Archive</span>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-excerpt">{hero.excerpt}</p>
          <div className="hero-meta meta-line">{metaDots([hero.emotion, `${hero.date} \u00b7 ${hero.time}`])}</div>
          <span className="hero-read-link">Read story <IconArrowRight /></span>
          <div className="hero-scroll-cue" aria-hidden="true"><span className="line" /><span>Scroll</span></div>
        </Link>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow section-eyebrow">Wander</span>
              <h2>Explore feelings</h2>
            </div>
            <Link href="/explore" className="section-link">All collections</Link>
          </div>
          <div className="collections-grid">
            {COLLECTIONS.map((c, i) => (
              <CollectionTile key={c.id} collection={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow section-eyebrow">Recently left behind</span>
              <h2>From the archive</h2>
            </div>
            <Link href="/keep" className="section-link">Your kept stories</Link>
          </div>
          <div className="stories-grid">
            {featured.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        </div>
      </section>

      <RandomSeal />
    </>
  );
}
