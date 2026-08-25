import Link from 'next/link';
import { Collection } from '@/lib/types';

export function CollectionTile({ collection, index }: { collection: Collection; index: number }) {
  return (
    <Link href={`/explore/${collection.id}`} className="collection-tile">
      <span className="tile-num">0{index + 1}</span>
      <div>
        <div className="tile-name">{collection.label}</div>
        <p className="tile-desc">{collection.desc}</p>
      </div>
    </Link>
  );
}
