'use client';

import { App, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

const theme = {
  token: {
    colorPrimary: '#1a1a1a',
    colorLink: '#1a1a1a',
    borderRadius: 8,
  },
};

export function AdminAntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
