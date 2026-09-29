import Image from 'next/image';

/**
 * The writer's own photo, "taped into" the diary page — small, tilted,
 * and secondary to the words. Only rendered when one was uploaded.
 */
export function StoryPhoto({ url, caption }: { url: string; caption?: string | null }) {
  return (
    <figure className="polaroid">
      <span className="tape" aria-hidden="true" />
      <div className="polaroid-img">
        <Image
          src={url}
          alt={caption || 'A photo the writer added to this entry'}
          fill
          sizes="(max-width: 720px) 62vw, 240px"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
