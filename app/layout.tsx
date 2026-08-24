import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://worksforreal.com'),
  title: 'Works for Real — AI, systems, and software that work',
  description: 'Senior strategy and engineering for AI, software, cloud, data, automation, DevOps, and cybersecurity that work in the real world.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Works for Real',
    description: 'AI, systems, and software that work in the real world.',
    url: '/',
    siteName: 'Works for Real',
    type: 'website',
    images: [{ url: '/og.png', width: 1536, height: 805, alt: 'Works for Real — AI, systems, and software that work.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Works for Real',
    description: 'AI, systems, and software that work in the real world.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
