import type { Metadata } from 'next';

export const metadata: Metadata = { title: '仪表板' };

export default function AdminDashboardPage() {
  return (
    <div className="p-6">
      <h1 className="mb-2 font-semibold text-2xl text-gray-900">仪表板</h1>
      <p className="text-gray-400 text-sm">欢迎使用管理后台。</p>
    </div>
  );
}
