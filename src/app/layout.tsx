import type { Metadata } from 'next';
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
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';


import { Atmosphere } from '@/components/Atmosphere';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { SearchOverlay } from '@/components/SearchOverlay';
import { RandomOverlay } from '@/components/RandomOverlay';
import { ToastProvider } from '@/contexts/ToastContext';
import { IdentityGate } from '@/components/IdentityGate';

export const metadata: Metadata = {
  title: 'The Unsent Archive — a diary that belongs to everyone',
  description:
    'A living archive of things people were never able to say. Read, write, and keep the quiet things.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <a className="skip-link" href="#main">Skip to content</a>
          <Atmosphere />
          <Nav />
          <main id="main" tabIndex={-1}>{children}</main>
          <Footer />
          <SearchOverlay />
          <RandomOverlay />
          <IdentityGate />
        </ToastProvider>
      </body>
    </html>
  );
}
