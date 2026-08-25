import { NextRequest, NextResponse } from 'next/server';
import { getRandomStory } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const excludeId = req.nextUrl.searchParams.get('exclude') || undefined;
  const story = await getRandomStory(excludeId);
  if (!story) {
    return NextResponse.json({ error: 'The archive is empty.' }, { status: 404 });
  }
  return NextResponse.json({ story });
}