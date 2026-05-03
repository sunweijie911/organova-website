import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import '@unocss/reset/tailwind.css';
import '@/styles/globals.css';
import { env } from '@/env';
import { DebugPanel } from '@/shared/components/debug-panel';
import { TRPCReactProvider } from '@/trpc/react';

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
    <html lang="zh">
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster position="top-center" richColors />
        <Suspense>
          <DebugPanel />
        </Suspense>
      </body>
    </html>
  );
}
