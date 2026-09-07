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
  title: 'Execution Department — Whatever it is. Executed.',
  description: 'Strategy and execution for AI, software, cloud infrastructure, data, automation, and ambitious technical work.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Execution Department — Whatever it is. Executed.',
    description: 'Strategy and execution for AI, software, cloud infrastructure, data, automation, and ambitious technical work.',
    url: '/',
    siteName: 'Execution Department',
    type: 'website',
    images: [{ url: '/og.png', width: 1732, height: 908, alt: 'Execution Department — Whatever it is. Executed.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Execution Department — Whatever it is. Executed.',
    description: 'Strategy and execution for AI, software, cloud infrastructure, data, automation, and ambitious technical work.',
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
