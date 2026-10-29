'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Sorry, an unexpected error occurred while loading this page.
        </p>
        <button
          className="mt-8 inline-block rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
