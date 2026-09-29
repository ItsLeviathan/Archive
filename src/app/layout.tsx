import type { Metadata, Viewport } from 'next';
import './globals.css';

// Self-hosted via @fontsource (bundled at build time — no runtime dependency
// on Google's font CDN). Only the weights/styles actually used are imported.
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/500-italic.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/400-italic.css';
// Fragment Mono only ships one weight — it reads like a typewritten ledger
// stamp, used for dates, times and small labels.
import '@fontsource/fragment-mono/400.css';
// Caveat is the "handwriting": signatures, margin notes, greetings.
import '@fontsource/caveat/500.css';
import '@fontsource/caveat/600.css';

import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SearchOverlay } from '@/components/SearchOverlay';
import { RandomOverlay } from '@/components/RandomOverlay';
import { ToastProvider } from '@/contexts/ToastContext';
import { IdentityGate } from '@/components/IdentityGate';
import { THEME_INIT_SCRIPT } from '@/components/ThemeToggle';

export const metadata: Metadata = {
  title: 'The Unsent Archive — a diary that belongs to everyone',
  description:
    'A shared diary of things people were never able to say. Read, write, and keep the quiet things.',
};

// viewportFit: 'cover' lets the CSS read env(safe-area-inset-*) so the nav
// and bottom tab bar clear the notch / home indicator on iOS.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4ecdd' },
    { media: '(prefers-color-scheme: dark)', color: '#1d1812' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Applies the saved day/night choice before first paint, so a
            night-mode reader never sees a flash of cream paper. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ToastProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <Nav />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <SearchOverlay />
          <RandomOverlay />
          <IdentityGate />
        </ToastProvider>
      </body>
    </html>
  );
}
