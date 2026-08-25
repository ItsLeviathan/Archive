import type { Metadata } from 'next';
import { COLLECTIONS } from '@/lib/data';
import { CollectionTile } from '@/components/CollectionTile';

export const metadata: Metadata = { title: 'Explore feelings — The Unsent Archive' };

export default function ExplorePage() {
  return (
    <>
      <div className="container">
        <div className="page-head">
          <span className="eyebrow">The Archive</span>
          <h1>Explore feelings</h1>
          <p>Not sad, happy, or angry. Just the quieter words for what people actually carry.</p>
        </div>
      </div>
      <div className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div className="collections-grid">
            {COLLECTIONS.map((c, i) => (
              <CollectionTile key={c.id} collection={c} index={i} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
