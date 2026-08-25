import { NextRequest, NextResponse } from 'next/server';
import { listStories, createStory, searchStories } from '@/lib/store';
import { COLLECTIONS } from '@/lib/data';
import { CollectionId, NewStoryInput } from '@/lib/types';

// GET Route Handlers are cached by default unless they use fetch() or opt
// out explicitly. This one reads the mutable in-memory store directly, so
// it must be forced dynamic or newly-published/felt-updated data would be
// served stale.
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (q) {
    const results = await searchStories(q);
    return NextResponse.json({ stories: results });
  }
  const stories = await listStories();
  return NextResponse.json({ stories });
}

export async function POST(req: NextRequest) {
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

  // --- server-side validation (the brief calls this out explicitly) ---
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
