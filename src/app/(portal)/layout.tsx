import type { CSSProperties } from 'react';
import { PortalFooter } from '@/components/PortalFooter';
import { PortalHeader } from '@/components/PortalHeader';
import { PortalStickyNav } from '@/components/PortalStickyNav';
import { PortalLayoutProvider } from '@/context/portal-layout-context';
import { getFrontendConfig } from '@/server/services/config';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cfg = await getFrontendConfig();
  const primaryColor = cfg.basic?.primaryColor || '#ff6b3d';

  return (
    <PortalLayoutProvider>
      <div
        style={
          {
            '--portal-primary': primaryColor,
            '--ant-color-primary': primaryColor,
          } as CSSProperties
        }
      >
        <PortalStickyNav />
        <PortalHeader />
        <main
          style={{
            paddingBottom: 'var(--sticky-nav-height, 0px)',
            transition: 'padding-bottom 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </main>
        <PortalFooter />
      </div>
    </PortalLayoutProvider>
  );
}
