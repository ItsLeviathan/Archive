'use client';

import { useEffect, useRef, useState } from 'react';
import { IconCamera } from './icons';

export interface PickedPhoto {
  blob: Blob;
  previewUrl: string;
}

const MAX_EDGE = 1600;
export const MAX_CAPTION_LENGTH = 140;

// Phone cameras produce 5–12 MB files; shrinking before upload makes
// publishing fast on a mobile connection. createImageBitmap applies the
// EXIF rotation, and re-drawing to a canvas drops the EXIF data itself
// (the server re-encodes again regardless — see lib/photos.ts).
async function downscale(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#fff'; // transparent PNGs would otherwise turn black as JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), 'image/jpeg', 0.85)
  );
}

export function PhotoPicker({
  photo,
  onPhotoChange,
  caption,
  onCaptionChange,
}: {
  photo: PickedPhoto | null;
  onPhotoChange: (photo: PickedPhoto | null) => void;
  caption: string;
  onCaptionChange: (caption: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Free the preview's memory whenever it's replaced or the page closes.
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.previewUrl); }, [photo]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('That isn’t an image. Choose a JPG, PNG or WebP photo.');
      return;
    }
    setBusy(true);
    try {
      const blob = await downscale(file);
      onPhotoChange({ blob, previewUrl: URL.createObjectURL(blob) });
    } catch {
      setError('This browser couldn’t open that photo. Try a JPG or PNG.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = ''; // allow re-picking the same file
    }
  }

  return (
    <fieldset className="write-field">
      <legend>Add a photo <span className="optional">(optional)</span></legend>

      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        aria-label="Choose a photo"
        accept="image/jpeg,image/png,image/webp,image/*"
        className="visually-hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {photo ? (
        <div className="photo-picked">
          <figure className="polaroid polaroid-preview">
            <span className="tape" aria-hidden="true" />
            <div className="polaroid-img">
              {/* A local blob: URL — next/image can't optimise it and doesn't need to. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.previewUrl} alt={caption || 'Your chosen photo'} />
            </div>
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
          <div className="photo-controls">
            <label htmlFor="photoCaption" className="field-label">Caption</label>
            <input
              id="photoCaption"
              className="field"
              placeholder="A few words about it (also read aloud to screen readers)"
              value={caption}
              maxLength={MAX_CAPTION_LENGTH}
              onChange={(e) => onCaptionChange(e.target.value)}
            />
            <div className="photo-buttons">
              <button type="button" className="btn-ghost" onClick={() => inputRef.current?.click()}>Replace</button>
              <button type="button" className="btn-ghost" onClick={() => { onPhotoChange(null); onCaptionChange(''); }}>
                Remove photo
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button type="button" className="photo-drop" onClick={() => inputRef.current?.click()} disabled={busy}>
          <IconCamera aria-hidden="true" />
          <span className="photo-drop-title">{busy ? 'Preparing photo…' : 'Choose a photo'}</span>
          <span className="field-hint">JPG, PNG or WebP. Location data is removed before it&rsquo;s shared.</span>
        </button>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}
      <p className="field-hint">Photos aren&rsquo;t kept in your saved draft &mdash; add it just before you publish.</p>
    </fieldset>
  );
}
