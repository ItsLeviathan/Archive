import type { Metadata } from 'next';
import { COLLECTIONS } from '@/lib/data';
import { CollectionTile } from '@/components/CollectionTile';

export const metadata: Metadata = { title: 'Chapters — The Unsent Archive' };

export default function ExplorePage() {
  return (
    <div className="container">
      <header className="page-head">
        <span className="stamp">Table of contents</span>
        <h1>Chapters</h1>
        <p>Not sad, happy, or angry &mdash; the quieter words for what people actually carry.</p>
      </header>
      <ol className="chapters-grid">
        {COLLECTIONS.map((c, i) => (
          <li key={c.id}><CollectionTile collection={c} index={i} /></li>
        ))}
      </ol>
    </div>
  );
}
