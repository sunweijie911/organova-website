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
        <h1 className="font-bold text-6xl text-gray-900">出错了</h1>
        <p className="mt-4 text-gray-600 text-lg">抱歉，页面加载时遇到了问题</p>
        <button
          className="mt-8 inline-block rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          onClick={reset}
          type="button"
        >
          重试
        </button>
      </div>
    </main>
  );
}
