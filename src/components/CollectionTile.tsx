import Link from 'next/link';
import { Collection } from '@/lib/types';

export function CollectionTile({ collection }: { collection: Collection; index?: number }) {
  return (
    <Link href={`/explore/${collection.id}`} className="collection-tile">
      <span className="tile-name">{collection.label}</span>
      <span className="tile-desc">{collection.desc}</span>
    </Link>
  );
}