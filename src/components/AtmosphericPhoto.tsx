import Image from 'next/image';
import { AtmosphericPhoto as AtmosphericPhotoData } from '@/lib/photos';

/**
 * A photograph "taped into" the diary page — small, tilted, and secondary
 * to the words. Per the design brief's "Photography" section: the photo
 * should support the story rather than overpower it.
 */
export function AtmosphericPhoto({ photo }: { photo: AtmosphericPhotoData }) {
  return (
    <figure className="polaroid">
      <span className="tape" aria-hidden="true" />
      <div className="polaroid-img">
        <Image src={photo.url} alt="" fill sizes="(max-width: 720px) 60vw, 240px" />
      </div>
      {photo.credit?.name && (
        <figcaption>
          <a href={photo.credit.url} target="_blank" rel="noopener noreferrer">
            photo: {photo.credit.name}
          </a>
        </figcaption>
      )}
    </figure>
  );
}
