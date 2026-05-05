import { PortalFooter } from '@/components/PortalFooter';
import { PortalHeader } from '@/components/PortalHeader';
import { PortalStickyNav } from '@/components/PortalStickyNav';
import { PortalLayoutProvider } from '@/context/portal-layout-context';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalLayoutProvider>
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
    </PortalLayoutProvider>
  );
}
