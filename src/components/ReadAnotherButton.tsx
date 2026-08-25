'use client';

import { IconArrowRight } from './icons';
import { requestOpenRandom } from '@/lib/events';

export function ReadAnotherButton({ excludeId }: { excludeId: string }) {
  return (
    <button
      type="button"
      className="story-foot-link primary"
      onClick={() => requestOpenRandom(excludeId)}
    >
      Read another stranger&rsquo;s heart <IconArrowRight />
    </button>
  );
}
