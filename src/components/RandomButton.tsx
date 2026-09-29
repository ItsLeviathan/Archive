'use client';

import { requestOpenRandom } from '@/lib/events';
import { IconShuffle } from './icons';

export function RandomButton({
  excludeId,
  className,
  icon = true,
  children,
}: {
  excludeId?: string;
  className?: string;
  icon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={() => requestOpenRandom(excludeId)}>
      {icon && <IconShuffle aria-hidden="true" />} {children}
    </button>
  );
}
