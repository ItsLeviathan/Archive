import { NextRequest, NextResponse } from 'next/server';
import { toggleFelt } from '@/lib/store';

// Simple in-memory rate limiter keyed by IP, per the brief's "rate limiting"
// requirement. Resets with the server process — swap for a durable store
// (e.g. Redis) in production.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 30;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_HITS;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = req.headers.get('x-forwarded-for') || 'local';
  if (isRateLimited(ip)) {
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
