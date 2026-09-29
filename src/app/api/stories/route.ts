import { NextRequest, NextResponse } from 'next/server';
import { listStories, listStoriesByIds, createStory, searchStories } from '@/lib/store';
import { COLLECTIONS } from '@/lib/data';
import { CollectionId, NewStoryInput } from '@/lib/types';
import { isRateLimited, clientKey } from '@/lib/rateLimit';
import { processPhoto, PhotoError, MAX_CAPTION_LENGTH } from '@/lib/photos';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (q) {
    const results = await searchStories(q);
    return NextResponse.json({ stories: results });
  }

  // Specific IDs (Keep uses this instead of downloading the full archive
  // and filtering client-side).
  const idsParam = req.nextUrl.searchParams.get('ids');
  if (idsParam) {
    const ids = idsParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const stories = await listStoriesByIds(ids);
    return NextResponse.json({ stories });
  }

  // Otherwise, paginated most-recent list.
  const limitParam = Number(req.nextUrl.searchParams.get('limit'));
  const offsetParam = Number(req.nextUrl.searchParams.get('offset'));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : undefined;
  const offset = Number.isFinite(offsetParam) && offsetParam >= 0 ? offsetParam : undefined;

  const stories = await listStories(limit, offset);
  return NextResponse.json({ stories });
}

export async function POST(req: NextRequest) {
  // A handful of submissions per IP per window is plenty for a genuine
  // person writing something down; it just slows scripted spam.
  if (isRateLimited(clientKey(req), 10 * 60_000, 5)) {
    return NextResponse.json(
      { error: 'Too many stories submitted recently. Please wait a little before writing another.' },
      { status: 429 }
    );
  }

  // The Write page sends multipart/form-data (so it can carry a photo);
  // plain JSON is still accepted for photo-less API clients.
  let payload: Partial<Record<keyof NewStoryInput, unknown>>;
  let photoFile: File | null = null;
  let photoCaption = '';
  try {
    if (req.headers.get('content-type')?.includes('multipart/form-data')) {
      const form = await req.formData();
      payload = Object.fromEntries(
        ['title', 'body', 'collection', 'author', 'date', 'time'].map((k) => [k, form.get(k) ?? undefined])
      );
      const photo = form.get('photo');
      if (photo instanceof File && photo.size > 0) photoFile = photo;
      const caption = form.get('photoCaption');
      if (typeof caption === 'string') photoCaption = caption.trim();
    } else {
      payload = await req.json();
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const collection = typeof payload.collection === 'string' ? payload.collection : undefined;
  const author = typeof payload.author === 'string' ? payload.author.trim() : undefined;
  // Sent by WriteFlow from the writer's own device clock (see WriteFlow.tsx).
  // Computing this on the server instead would stamp every story with the
  // server's timezone (usually UTC), not the writer's — a plain string, so
  // just cap the length rather than trying to parse/validate a format.
  const date =
    typeof payload.date === 'string' && payload.date.trim().length <= 40
      ? payload.date.trim()
      : undefined;
  const time =
    typeof payload.time === 'string' && payload.time.trim().length <= 20
      ? payload.time.trim()
      : undefined;

  // --- server-side validation (unchanged) ---
  if (title.length < 2 || title.length > 200) {
    return NextResponse.json(
      { error: 'Title must be between 2 and 200 characters.' },
      { status: 400 }
    );
  }
  if (body.length < 3 || body.length > 20000) {
    return NextResponse.json(
      { error: 'Story must be between 3 and 20,000 characters.' },
      { status: 400 }
    );
  }
  const validCollectionIds = COLLECTIONS.map((c) => c.id);
  if (!collection || !validCollectionIds.includes(collection as CollectionId)) {
    return NextResponse.json({ error: 'A valid collection is required.' }, { status: 400 });
  }
  if (author && author.length > 60) {
    return NextResponse.json({ error: 'Name is too long.' }, { status: 400 });
  }

  if (photoCaption.length > MAX_CAPTION_LENGTH) {
    return NextResponse.json({ error: 'Photo caption is too long.' }, { status: 400 });
  }
  // Text checks come first — no point decoding an image for a request
  // that would be rejected anyway.
  let photo: NewStoryInput['photo'];
  if (photoFile) {
    try {
      photo = { data: await processPhoto(await photoFile.arrayBuffer()), caption: photoCaption };
    } catch (e) {
      if (e instanceof PhotoError) return NextResponse.json({ error: e.message }, { status: 400 });
      throw e;
    }
  }

  const story = await createStory({
    title,
    body,
    collection: collection as CollectionId,
    author,
    date,
    time,
    photo,
  });

  return NextResponse.json({ story }, { status: 201 });
}