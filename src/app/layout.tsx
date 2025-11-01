import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '../components/Navigation';
import StarField from '../components/ui/StarField';
import ConditionalScrollButton from '@/components/common/ConditionalScrollButton';
import Footer from '@/components/ui/Footer';
import GlobalMobileOverlay from '@/components/GlobalMobileOverlay';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arisa - Portfolio',
  description: 'Backend Engineer & Security Engineer Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen relative isolate`}>

        {/* modal */}
        <div id="modal-root" />

        {/* Cosmic background effects */}
        <StarField />

        {/* Navigation bar (z-20 ensures it's above the background) */}
        <Navigation />

        {/* Global mobile menu overlay */}
        <GlobalMobileOverlay />

        {/* Main content (under nav but above background) */}
        <main className="relative z-10">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* === Scroll toggle only on specific pages === */}
        <ConditionalScrollButton />
      </body>
    </html>
  );
}