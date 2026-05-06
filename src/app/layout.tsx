import type { Metadata } from 'next';
import { Roboto, Roboto_Serif } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import '@unocss/reset/tailwind.css';
import '@/styles/globals.css';
import { DebugPanel } from '@/components/DebugPanel';
import { TRPCReactProvider } from '@/lib/trpc/react';
import { getSiteName } from '@/server/services/config';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-roboto',
  display: 'swap',
});

const robotoSerif = Roboto_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-roboto-serif',
  display: 'swap',
});

const SITE_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';
const SITE_DESCRIPTION =
  'Patient-derived organoid (PDO) platform enabling precision oncology drug discovery, efficacy testing, and translational research.';

export async function generateMetadata(): Promise<Metadata> {
  const siteName = await getSiteName();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: SITE_DESCRIPTION,
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
    openGraph: {
      type: 'website',
      siteName,
      locale: 'en_US',
      description: SITE_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${roboto.variable} ${robotoSerif.variable}`} lang="en">
      <body style={{ fontFamily: 'var(--font-roboto), sans-serif' }}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster position="top-center" richColors />
        <Suspense>
          <DebugPanel />
        </Suspense>
      </body>
    </html>
  );
}
