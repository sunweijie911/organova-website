import { env } from '@/env';

export function PortalFooter() {
  return (
    <footer className="border-gray-200 border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} {env.NEXT_PUBLIC_SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
