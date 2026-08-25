import Link from 'next/link';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-tagline">A diary that belongs to everyone.</p>
        <div className="footer-links">
          <Link href="/explore">Explore</Link>
          <Link href="/write">Write</Link>
          <Link href="/keep">Keep</Link>
        </div>
      </div>
    </footer>
  );
}
