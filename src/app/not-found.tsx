import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container narrow">
      <div className="empty-state">
        <p className="hand">This page was torn out.</p>
        <p className="em-title">We couldn&rsquo;t find what you were looking for.</p>
        <p><Link href="/">Back to the latest entries</Link></p>
      </div>
    </div>
  );
}
