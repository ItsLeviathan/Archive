import type { Metadata, Viewport } from 'next';
import './globals.css';

// Self-hosted via @fontsource (bundled at build time — no runtime dependency
// on Google's font CDN). Only the weights/styles actually used are imported.
import '@fontsource/fraunces/300.css';
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/500.css';
import '@fontsource/fraunces/600.css';
import '@fontsource/fraunces/400-italic.css';
import '@fontsource/fraunces/500-italic.css';
import '@fontsource/fraunces/600-italic.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/400-italic.css';
import '@fontsource/newsreader/500-italic.css';
// Fragment Mono only ships one weight (regular) plus italic — that's the
// whole family, so there's no 500/600 to import. It reads like a
// typewritten ledger entry for labels/metadata/nav, which fits a diary
// that stamps every story with a date and time.
import '@fontsource/fragment-mono/400.css';
import '@fontsource/fragment-mono/400-italic.css';

import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SearchOverlay } from '@/components/SearchOverlay';
import { RandomOverlay } from '@/components/RandomOverlay';
import { ToastProvider } from '@/contexts/ToastContext';
import { IdentityGate } from '@/components/IdentityGate';
import { PageTransition } from '@/components/PageTransition';

export const metadata: Metadata = {
  title: 'The Unsent Archive — a diary that belongs to everyone',
  description:
    'A living archive of things people were never able to say. Read, write, and keep the quiet things.',
};

// viewportFit: 'cover' lets the CSS in globals.css read env(safe-area-inset-*)
// so the nav, footer, toast, and mobile menu clear the notch / home-indicator
// on iOS instead of sitting flush against it. themeColor tints the mobile
// browser chrome (status bar / address bar) to match the app's background
// instead of defaulting to white, which otherwise flashes on load.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#221a10',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <Atmosphere />
          <Nav />
          <main id="main" tabIndex={-1}>
            <PageTransition>{children}</PageTransition>
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