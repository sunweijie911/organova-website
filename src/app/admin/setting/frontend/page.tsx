import type { Metadata } from 'next';
import AdminSettingFrontend from '@/views/admin/setting/frontend';

export const metadata: Metadata = { title: '前端配置' };

export default function AdminSettingFrontendPage() {
  return <AdminSettingFrontend />;
}
