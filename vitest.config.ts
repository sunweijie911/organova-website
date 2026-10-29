import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      SKIP_ENV_VALIDATION: '1',
      ADMIN_EMAILS: 'admin@test.local',
    },
    environment: 'node',
    globals: true,
    passWithNoTests: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/server/**/*.ts', 'src/lib/**/*.ts'],
      // 以当前实测值为下限（需连接数据库运行集成测试），补测试后逐步上调
      thresholds: {
        lines: 28,
        functions: 25,
        branches: 20,
        statements: 28,
      },
    },
    exclude: [
      'node_modules',
      '.next',
      'coverage',
      'e2e',
      'playwright-report',
      'test-results',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './tests/stubs/empty.ts'),
    },
  },
});
