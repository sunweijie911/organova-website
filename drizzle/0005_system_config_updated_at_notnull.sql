-- systemConfig.updatedAt 升级为乐观锁版本字段：
-- 1) 回填历史 NULL 值为 createdAt（即"自始未被修改"）
-- 2) 设置 NOT NULL + 默认 now()
UPDATE "organova_system_config" SET "updatedAt" = "createdAt" WHERE "updatedAt" IS NULL;--> statement-breakpoint
ALTER TABLE "organova_system_config" ALTER COLUMN "updatedAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "organova_system_config" ALTER COLUMN "updatedAt" SET NOT NULL;
