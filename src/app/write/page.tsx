import type { Metadata } from 'next';
import { WriteFlow } from '@/components/WriteFlow';

export const metadata: Metadata = { title: 'Write — The Unsent Archive' };

export default function WritePage() {
  return <WriteFlow />;
}
