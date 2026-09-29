import Link from 'next/link';
import { Collection } from '@/lib/types';
import { chapterNumeral } from '@/lib/format';

export function CollectionTile({ collection, index }: { collection: Collection; index: number }) {
  return (
    <Link href={`/explore/${collection.id}`} className="chapter-card">
      <span className="chapter-num">{chapterNumeral(index)}</span>
      <span className="chapter-name">{collection.label}</span>
      <span className="chapter-desc">{collection.desc}</span>
      <span className="chapter-go">Open chapter &rarr;</span>
    </Link>
  );
}
