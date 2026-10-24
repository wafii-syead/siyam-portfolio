import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import './globals.css';
import { siteUrl } from '@/lib/site-url';
const url = siteUrl();
export const metadata: Metadata = {
  metadataBase: new URL(url || 'http://localhost:4173'),
  ...(url ? { alternates: { canonical: '/' } } : {}),
  title: 'Shariyar Siyam — Graphic Designer, UI/UX Designer & Canva Expert',
  description: 'Brand visuals, intuitive interfaces, and editable content by Shariyar Siyam, Graphic Designer at Raytas.co, UI/UX Designer, and Canva Expert.',
  openGraph: { title: 'Shariyar Siyam — Design that stands out.', description: 'Explore brand identities, digital interfaces, and creative visual work.', type: 'website', ...(url ? { url, images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Shariyar Siyam — Graphic Designer, UI/UX Designer & Canva Expert' }] } : {}) },
  twitter: { card: 'summary_large_image', title: 'Shariyar Siyam — Design that stands out.', ...(url ? { images: ['/opengraph-image'] } : {}) },
  robots: process.env.VERCEL_ENV === 'preview' ? { index: false, follow: false } : { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
