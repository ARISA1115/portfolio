import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/layout/Navigation';
import StarField from '@/components/ui/StarField';
import ConditionalScrollButton from '@/components/common/ConditionalScrollButton';
import Footer from '@/components/ui/Footer';
import GlobalMobileOverlay from '@/components/layout/GlobalMobileOverlay';

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

        <div id="modal-root" />

        <StarField />

        <Navigation />

        <GlobalMobileOverlay />

        <main className="relative z-10">
          {children}
        </main>

        <Footer />

        <ConditionalScrollButton />
      </body>
    </html>
  );
}
