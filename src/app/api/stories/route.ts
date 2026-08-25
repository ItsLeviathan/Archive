import { NextRequest, NextResponse } from 'next/server';
import { listStories, listStoriesByIds, createStory, searchStories } from '@/lib/store';
import { COLLECTIONS } from '@/lib/data';
import { CollectionId, NewStoryInput } from '@/lib/types';
import { isRateLimited, clientKey } from '@/lib/rateLimit';

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

  let payload: Partial<NewStoryInput>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  const collection = payload.collection;
  const author = typeof payload.author === 'string' ? payload.author.trim() : undefined;

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

  const story = await createStory({
    title,
    body,
    collection: collection as CollectionId,
    author,
  });

  return NextResponse.json({ story }, { status: 201 });
}