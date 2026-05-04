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
      <main>{children}</main>
      <PortalFooter />
    </PortalLayoutProvider>
  );
}
