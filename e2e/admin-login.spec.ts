import { expect, test } from '@playwright/test';

// 需以 AUTH_METHOD=email-password 启动，并预先用 scripts/seed-admin.ts 创建该管理员
const email = process.env.E2E_ADMIN_EMAIL;
const password = process.env.E2E_ADMIN_PASSWORD;

test.describe('管理员登录', () => {
  test.skip(!email || !password, '未配置 E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD');

  test('邮箱密码登录后回到 callbackUrl 指定的后台页面', async ({ page }) => {
    await page.goto('/signin?callbackUrl=/admin/news');
    await page.locator('input[type="email"]').fill(email ?? '');
    await page.locator('input[type="password"]').fill(password ?? '');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/admin\/news$/);
    await expect(
      page.getByRole('menuitem', { name: '案例研究' }),
    ).toBeVisible();
  });

  test('callbackUrl 指向外部站点时登录后留在本站', async ({ page }) => {
    await page.goto(
      `/signin?callbackUrl=${encodeURIComponent('/\\evil.example')}`,
    );
    await page.locator('input[type="email"]').fill(email ?? '');
    await page.locator('input[type="password"]').fill(password ?? '');
    await page.locator('button[type="submit"]').click();

    await page.waitForURL((url) => !url.pathname.startsWith('/signin'));
    expect(new URL(page.url()).host).toBe('localhost:3000');
  });

  test('错误密码停留在登录页并提示', async ({ page }) => {
    await page.goto('/signin');
    await page.locator('input[type="email"]').fill(email ?? '');
    await page.locator('input[type="password"]').fill('wrong-password-123');
    const response = page.waitForResponse((res) =>
      res.url().includes('/api/auth/sign-in/email'),
    );
    await page.locator('button[type="submit"]').click();

    expect((await response).ok()).toBe(false);
    await expect(page.getByText('邮箱或密码错误')).toBeVisible();
    await expect(page).toHaveURL(/\/signin/);
  });
});
