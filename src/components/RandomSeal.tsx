'use client';

import { IconHeart } from './icons';
import { requestOpenRandom } from '@/lib/events';

export function RandomSeal() {
  return (
    <section className="seal-section container">
      <button
        type="button"
        className="seal-btn"
        onClick={() => requestOpenRandom()}
        aria-label="Open a stranger's heart — read a random story"
      >
        <IconHeart />
      </button>
      <p className="seal-label">Open a stranger&rsquo;s heart</p>
      <p className="seal-sub">You never know what you&rsquo;ll find</p>
    </section>
  );
}
