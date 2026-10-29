import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page not found</p>
        <Link
          className="mt-8 inline-block rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          href="/"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
