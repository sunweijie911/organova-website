import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="font-bold text-6xl text-gray-900">404</h1>
        <p className="mt-4 text-gray-600 text-lg">页面未找到</p>
        <Link
          className="mt-8 inline-block rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          href="/"
        >
          返回首页
        </Link>
      </div>
    </main>
  );
}
