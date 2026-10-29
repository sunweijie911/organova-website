'use client';

import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// 本次页面会话内是否发生过站内路由跳转；为 true 时 router.back() 必然回到本站页面
let hasInAppHistory = false;

export function canGoBackInApp(): boolean {
  return hasInAppHistory;
}

export interface PortalLayoutVisible {
  header: boolean;
}

export interface PortalLayoutContextType {
  layoutVisible: PortalLayoutVisible;
  setLayoutVisible: (visible: Partial<PortalLayoutVisible>) => void;
  resetLayout: () => void;
}

const DEFAULT: PortalLayoutVisible = { header: true };

const PortalLayoutContext = createContext<PortalLayoutContextType | null>(null);

export function PortalLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layoutVisible, setLayoutVisibleState] = useState<PortalLayoutVisible>({
    ...DEFAULT,
  });

  const pathname = usePathname();
  const initialPathname = useRef(pathname);
  useEffect(() => {
    if (pathname !== initialPathname.current) hasInAppHistory = true;
  }, [pathname]);

  const setLayoutVisible = useCallback(
    (visible: Partial<PortalLayoutVisible>) => {
      setLayoutVisibleState((prev) => ({ ...prev, ...visible }));
    },
    [],
  );

  const resetLayout = useCallback(
    () => setLayoutVisibleState({ ...DEFAULT }),
    [],
  );

  const value = useMemo<PortalLayoutContextType>(
    () => ({ layoutVisible, setLayoutVisible, resetLayout }),
    [layoutVisible, setLayoutVisible, resetLayout],
  );

  return (
    <PortalLayoutContext.Provider value={value}>
      {children}
    </PortalLayoutContext.Provider>
  );
}

export function usePortalLayout(): PortalLayoutContextType {
  const ctx = useContext(PortalLayoutContext);
  if (!ctx)
    throw new Error('usePortalLayout must be used within PortalLayoutProvider');
  return ctx;
}
