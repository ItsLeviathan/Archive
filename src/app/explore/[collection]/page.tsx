import Link from 'next/link';
import { listStories } from '@/lib/store';
import { getStoryPhoto } from '@/lib/photos';
import { COLLECTIONS } from '@/lib/data';
import { StoryCard } from '@/components/StoryCard';
import { CollectionTile } from '@/components/CollectionTile';
import { RandomSeal } from '@/components/RandomSeal';
import { HeroConstellation } from '@/components/HeroConstellation';
import { AtmosphericPhoto } from '@/components/AtmosphericPhoto';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const stories = await listStories();
  const hero = stories[0];
  const featured = stories.slice(1, 9);
  const constellationNodes = stories.slice(1, 18).map((s) => ({ id: s.id, title: s.title }));

  // Keyed to this specific story (not just its collection), so a
  // different hero story shows a different backdrop even within the
  // same collection.
  const heroPhoto = hero ? await getStoryPhoto(hero.id, hero.collection) : null;

  return (
    <>
      <section className="hero">
        {heroPhoto && <AtmosphericPhoto photo={heroPhoto} />}
        <HeroConstellation nodes={constellationNodes} />
        <div className="hero-content">
          <span className="eyebrow hero-kicker">The Unsent Archive</span>
          <h1 className="hero-statement">
            Some words are never spoken.
            <br />
            They still deserve somewhere to live.
          </h1>
          <Link href="/write" className="hero-cta">
            Write what you never said.
          </Link>
          <p className="hero-sub">
            Left anonymously, kept gently &mdash; a quiet room for the things
            you couldn&rsquo;t say out loud.
          </p>

          {hero && (
            <Link href={`/story/${hero.id}`} className="hero-featured">
              <span className="hero-featured-label">Tonight, someone wrote</span>
              <span className="hero-featured-title">&ldquo;{hero.title}&rdquo;</span>
            </Link>
          )}

          <div className="hero-scroll-cue" aria-hidden="true">
            <span className="line" />
            <span>Scroll</span>
          </div>
        </div>
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
            {COLLECTIONS.map((c) => (
              <CollectionTile key={c.id} collection={c} />
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