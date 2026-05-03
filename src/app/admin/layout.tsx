import { redirect } from 'next/navigation';
import { getSession } from '@/server/better-auth/server';
import { isAdminEmail } from '@/server/services/admin-check';
import { AdminShell } from './admin-shell';
import { AdminAntdProvider } from './antd-provider';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect('/signin');

  if (!isAdminEmail(session.user.email)) {
    redirect('/');
  }

  return (
    <AdminAntdProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAntdProvider>
  );
}
