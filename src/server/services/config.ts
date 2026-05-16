import 'server-only';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import { type FrontendConfig, mergeConfig } from '@/lib/frontend-config';
import { pickI18nText } from '@/lib/i18n-text';
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
    console.warn(
      `[config] getConfigValue 读取失败，已降级为 null (key=${key}):`,
      error,
    );
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
// 与默认值合并后返回。用 React.cache 包装，确保单次请求内只查一次 DB。
export const getFrontendConfig = cache(async (): Promise<FrontendConfig> => {
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
    console.warn(
      '[config] getFrontendConfig 读取失败，已降级为默认配置:',
      error,
    );
    return mergeConfig({});
  }
});

// 后台站点名（admin 顶栏、登录页 logo）。优先 basic.systemTitle，回退到 fallback。
export async function getSiteName(
  lang: 'zh-CN' | 'en-US' = 'zh-CN',
): Promise<string> {
  const cfg = await getFrontendConfig();
  return pickI18nText(cfg.basic?.systemTitle, lang, SITE_NAME_FALLBACK);
}

// 门户 SEO 标题。优先 seo.defaultTitle，缺失时回退 basic.systemTitle、再回退 fallback。
export async function getPortalTitle(
  lang: 'zh-CN' | 'en-US' = 'en-US',
): Promise<string> {
  const cfg = await getFrontendConfig();
  return pickI18nText(
    cfg.seo?.defaultTitle,
    lang,
    pickI18nText(cfg.basic?.systemTitle, lang, SITE_NAME_FALLBACK),
  );
}
