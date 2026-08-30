import Image from 'next/image';
import { AtmosphericPhoto as AtmosphericPhotoData } from '@/lib/photos';

/**
 * A real photograph used purely as a backdrop — darkened, desaturated,
 * and always behind other content. Per the design brief's "Photography"
 * section: "the photograph should support the story rather than
 * overpower it." Never used as the visual centerpiece.
 *
 * Render this as the first child inside a `position: relative` container
 * (see the `.atmo-frame` / `.atmo-content` pattern in
 * atmospheric-photo.css), so it sits behind that container's real
 * content automatically.
 */
export function AtmosphericPhoto({ photo }: { photo: AtmosphericPhotoData }) {
  return (
    <div className="atmospheric-photo">
      <Image
        src={photo.url}
        alt=""
        fill
        sizes="100vw"
        className="atmospheric-photo-img"
      />
      {photo.credit && (
        <a
          className="atmospheric-photo-credit"
          href={photo.credit.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Photo: {photo.credit.name}
        </a>
      )}
    </div>
  );
}