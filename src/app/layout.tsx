import type { Metadata } from 'next';
import { Roboto, Roboto_Serif } from 'next/font/google';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import '@unocss/reset/tailwind.css';
import '@/styles/globals.css';
import { DebugPanel } from '@/components/DebugPanel';
import { env } from '@/env';
import { TRPCReactProvider } from '@/lib/trpc/react';

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

export const metadata: Metadata = {
  title: {
    default: env.NEXT_PUBLIC_SITE_NAME,
    template: `%s | ${env.NEXT_PUBLIC_SITE_NAME}`,
  },
  description: '',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${roboto.variable} ${robotoSerif.variable}`} lang="zh">
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
