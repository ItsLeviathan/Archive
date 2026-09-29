import sharp from 'sharp';

/**
 * Writer-uploaded story photos.
 *
 * Every upload is decoded and re-encoded here rather than stored as sent:
 *  - anything that isn't a real image fails to decode and is rejected,
 *    whatever its claimed content type;
 *  - EXIF/GPS metadata is dropped (sharp strips it unless asked to keep
 *    it) — important on an archive where people write anonymously and a
 *    phone photo can carry their home's coordinates;
 *  - output is a bounded-size WebP, so storage and page weight stay sane.
 */

export const PHOTO_BUCKET = 'story-photos';
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // pre-processing; the client downsizes first
export const MAX_CAPTION_LENGTH = 140;
const MAX_EDGE = 1600;

export class PhotoError extends Error {}

export async function processPhoto(input: ArrayBuffer): Promise<Buffer> {
  if (input.byteLength > MAX_UPLOAD_BYTES) {
    throw new PhotoError('That photo is too large. Please choose one under 8 MB.');
  }
  try {
    return await sharp(Buffer.from(input), { limitInputPixels: 50_000_000 })
      .rotate() // apply EXIF orientation before the metadata is discarded
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new PhotoError('That file couldn’t be read as a photo. Try a JPG or PNG.');
  }
}
