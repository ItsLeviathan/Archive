import { NextRequest, NextResponse } from 'next/server';
import { toggleFelt } from '@/lib/store';
import { isRateLimited, clientKey } from '@/lib/rateLimit';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (isRateLimited(clientKey(req), 60_000, 30)) {
    return NextResponse.json({ error: 'Too many requests. Slow down a little.' }, { status: 429 });
  }

  const { id } = await params;
  let payload: { felt?: boolean };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const story = await toggleFelt(id, payload.felt !== false);
  if (!story) {
    return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
  }
  return NextResponse.json({ felt: story.felt });
}