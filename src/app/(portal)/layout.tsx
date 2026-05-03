import { PortalFooter } from '@/shared/components/layout/portal-footer';
import { PortalHeader } from '@/shared/components/layout/portal-header';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <PortalHeader />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}
