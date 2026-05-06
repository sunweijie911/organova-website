import 'server-only';
import { eq } from 'drizzle-orm';
import { type FrontendConfig, mergeConfig } from '@/lib/frontend-config';
import { db } from '@/server/db';
import { systemConfig } from '@/server/db/schema';

const FRONTEND_CONFIG_KEY = 'frontend';
const SITE_NAME_FALLBACK = 'Organova';

export async function getConfigValue(key: string): Promise<string | null> {
  try {
    const row = await db
      .select({ value: systemConfig.value })
      .from(systemConfig)
      .where(eq(systemConfig.key, key))
      .limit(1);
    if (row.length > 0 && row[0]?.value != null) {
      const v = row[0]?.value;
      return typeof v === 'string' ? v : String(v);
    }
    return null;
  } catch (error) {
    console.error('[config] getConfigValue failed for key:', key, error);
    return null;
  }
}

export async function getConfigString(
  key: string,
  fallback: string,
): Promise<string> {
  const value = await getConfigValue(key);
  return value ?? fallback;
}

// 服务端读取门户前端配置（systemConfig 表 key='frontend' 下的 JSONB），
// 与默认值合并后返回。用于 SSR / metadata / Server Component。
export async function getFrontendConfig(): Promise<FrontendConfig> {
  try {
    const row = await db
      .select({ value: systemConfig.value })
      .from(systemConfig)
      .where(eq(systemConfig.key, FRONTEND_CONFIG_KEY))
      .limit(1);
    const stored = row[0]?.value;
    return mergeConfig(
      typeof stored === 'object' && stored !== null
        ? (stored as Partial<FrontendConfig>)
        : {},
    );
  } catch (error) {
    console.error('[config] getFrontendConfig failed:', error);
    return mergeConfig({});
  }
}

// 站点名（用于 <title>、admin 顶栏、登录页 logo）。从门户后台 basic.systemTitle 读取。
export async function getSiteName(
  lang: 'zh-CN' | 'en-US' = 'zh-CN',
): Promise<string> {
  const cfg = await getFrontendConfig();
  const title = cfg.basic?.systemTitle as Record<string, string> | undefined;
  if (!title) return SITE_NAME_FALLBACK;
  return (
    title[lang] ||
    title['zh-CN'] ||
    title['en-US'] ||
    Object.values(title).find((v) => v) ||
    SITE_NAME_FALLBACK
  );
}
