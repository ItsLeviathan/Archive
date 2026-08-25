'use client';

import Link from 'next/link';
import { useMemo } from 'react';

interface Node { id: string; title: string; }

// Deterministic pseudo-random so server/client markup match (no Math.random()).
function seeded(n: number) {
  const x = Math.sin(n * 999) * 10000;
  return x - Math.floor(x);
}

export function HeroConstellation({ nodes }: { nodes: Node[] }) {
  const positioned = useMemo(
    () =>
      nodes.map((n, i) => ({
        ...n,
        top: 6 + seeded(i * 3.1) * 84,
        left: 3 + seeded(i * 7.7) * 94,
        size: 3 + seeded(i * 5.3) * 4,
        duration: 14 + seeded(i * 2.9) * 16,
        delay: seeded(i * 4.4) * -20,
      })),
    [nodes]
  );

  return (
    <div className="constellation">
      {positioned.map((n) => (
        <Link
          key={n.id}
          href={`/story/${n.id}`}
          className="constellation-node"
          tabIndex={-1}
          aria-hidden="true"
          style={{
            top: `${n.top}%`,
            left: `${n.left}%`,
            width: `${n.size}px`,
            height: `${n.size}px`,
            animationDuration: `${n.duration}s`,
            animationDelay: `${n.delay}s`,
          }}
        >
          <span className="constellation-tip">{n.title}</span>
        </Link>
      ))}
    </div>
  );
}