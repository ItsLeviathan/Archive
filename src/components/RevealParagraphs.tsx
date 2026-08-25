'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function RevealParagraphs({ paragraphs }: { paragraphs: string[] }) {
  const reduced = useReducedMotion();

  return (
    <div className="story-body">
      {paragraphs.map((p, i) => (
        <motion.p
          key={i}
          initial={reduced ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -8% 0px', amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {p}
        </motion.p>
      ))}
    </div>
  );
}
