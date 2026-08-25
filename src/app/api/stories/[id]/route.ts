import { NextRequest, NextResponse } from 'next/server';
import { getStory } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const story = await getStory(id);
  if (!story) {
    return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
  }
  return NextResponse.json({ story });
}
