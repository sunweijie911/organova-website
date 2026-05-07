import 'server-only';
import { inArray, lt } from 'drizzle-orm';
import { db } from '@/server/db';
import { adminAuditLog, systemConfig } from '@/server/db/schema';

const KEY_ENABLED = 'audit_log_auto_purge_enabled';
const KEY_RETENTION = 'audit_log_retention_days';
const KEY_LAST_PURGE = 'audit_log_last_purge_at';

const DEFAULT_RETENTION_DAYS = 90;
const DAY_MS = 24 * 60 * 60 * 1000;
const PURGE_INTERVAL_MS = DAY_MS; // 距上次清理 ≥ 24h 才会再次触发

export type AuditPurgeConfig = {
  enabled: boolean;
  retentionDays: number;
  /** ISO 字符串，从未清理过则为 null */
  lastPurgeAt: string | null;
};

async function readConfigKeys(keys: string[]) {
  const rows = await db
    .select()
    .from(systemConfig)
    .where(inArray(systemConfig.key, keys));
  return new Map(rows.map((r) => [r.key, r.value]));
}

async function upsertConfig(key: string, value: unknown) {
  await db
    .insert(systemConfig)
    .values({ key, value: value as never })
    .onConflictDoUpdate({
      target: systemConfig.key,
      set: { value: value as never },
    });
}

export async function getAuditPurgeConfig(): Promise<AuditPurgeConfig> {
  const map = await readConfigKeys([
    KEY_ENABLED,
    KEY_RETENTION,
    KEY_LAST_PURGE,
  ]);
  const enabled = map.get(KEY_ENABLED);
  const retention = map.get(KEY_RETENTION);
  const lastPurge = map.get(KEY_LAST_PURGE);
  return {
    enabled: typeof enabled === 'boolean' ? enabled : true,
    retentionDays:
      typeof retention === 'number' && retention > 0
        ? retention
        : DEFAULT_RETENTION_DAYS,
    lastPurgeAt: typeof lastPurge === 'string' ? lastPurge : null,
  };
}

export async function setAuditPurgeConfig(input: {
  enabled: boolean;
  retentionDays: number;
}) {
  await Promise.all([
    upsertConfig(KEY_ENABLED, input.enabled),
    upsertConfig(KEY_RETENTION, input.retentionDays),
  ]);
}

/**
 * 懒触发清理：距上次清理 ≥ 24h 才执行一次，失败仅记日志，不影响调用方。
 */
export async function maybePurgeAuditLogs(): Promise<void> {
  try {
    const cfg = await getAuditPurgeConfig();
    if (!cfg.enabled) return;

    const last = cfg.lastPurgeAt ? new Date(cfg.lastPurgeAt).getTime() : 0;
    if (Date.now() - last < PURGE_INTERVAL_MS) return;

    const cutoff = new Date(Date.now() - cfg.retentionDays * DAY_MS);
    await db.delete(adminAuditLog).where(lt(adminAuditLog.createdAt, cutoff));
    await upsertConfig(KEY_LAST_PURGE, new Date().toISOString());
  } catch (err) {
    console.error('[audit-purge] 自动清理失败:', err);
  }
}
