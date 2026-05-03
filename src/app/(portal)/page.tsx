import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-bold text-4xl text-gray-900 tracking-tight sm:text-6xl">
          欢迎使用
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-gray-500 text-lg">
          请登录后继续
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            className="rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-700"
            href="/signin"
          >
            立即登录
          </Link>
        </div>
      </div>
    </section>
  );
}
