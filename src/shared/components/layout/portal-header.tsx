'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { env } from '@/env';
import { authClient } from '@/lib/auth-client';
import { api } from '@/trpc/react';

export function PortalHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const { data: isAdmin } = api.sys.checkRole.useQuery(undefined, {
    enabled: !!session?.user,
    staleTime: Number.POSITIVE_INFINITY,
  });

  return (
    <header className="sticky top-0 z-50 w-full border-gray-200 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="font-bold text-gray-900 text-xl" href="/">
          {env.NEXT_PUBLIC_SITE_NAME}
        </Link>

        <div className="flex items-center gap-4">
          {/* 桌面端导航 */}
          <nav className="hidden items-center gap-4 md:flex">
            {isAdmin && (
              <Link
                className={`font-medium text-sm transition-colors ${
                  pathname.startsWith('/admin')
                    ? 'text-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                href="/admin"
              >
                管理后台
              </Link>
            )}
            {session?.user ? (
              <button
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-gray-600 text-sm transition-colors hover:bg-gray-50"
                onClick={() => {
                  toast('确定要退出登录吗？', {
                    action: {
                      label: '确定退出',
                      onClick: () => {
                        authClient.signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              window.location.href = '/';
                            },
                          },
                        });
                      },
                    },
                    cancel: { label: '取消', onClick: () => {} },
                  });
                }}
                type="button"
              >
                退出登录
              </button>
            ) : (
              <Link
                className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-gray-700"
                href="/signin"
              >
                登录
              </Link>
            )}
          </nav>

          {/* 移动端汉堡 */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-4 border-gray-200 border-t bg-white px-6 py-4 md:hidden">
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)}>
              管理后台
            </Link>
          )}
          {session?.user ? (
            <button
              className="text-left text-gray-600 text-sm"
              onClick={() => {
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = '/';
                    },
                  },
                });
              }}
              type="button"
            >
              退出登录
            </button>
          ) : (
            <Link href="/signin" onClick={() => setMenuOpen(false)}>
              登录
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
