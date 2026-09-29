import type { Metadata } from 'next';
import { WriteFlow } from '@/components/WriteFlow';

export const metadata: Metadata = { title: 'Write — The Unsent Archive' };

export default async function WritePage({
  searchParams,
}: {
  searchParams: Promise<{ chapter?: string | string[] }>;
}) {
  const { chapter } = await searchParams;
  return <WriteFlow initialChapter={typeof chapter === 'string' ? chapter : undefined} />;
}
