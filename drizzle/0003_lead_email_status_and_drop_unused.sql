-- 1) leads 表新增邮件发送状态字段，用于运营补救线索通知失败
ALTER TABLE "organova_lead" ADD COLUMN IF NOT EXISTS "email_send_status" varchar(16) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "organova_lead" ADD COLUMN IF NOT EXISTS "email_error" text;--> statement-breakpoint
ALTER TABLE "organova_lead" ADD COLUMN IF NOT EXISTS "email_sent_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lead_email_send_status_idx" ON "organova_lead" USING btree ("email_send_status");--> statement-breakpoint

-- 2) 清理 0000 迁移建过但代码从未使用的死表
DROP TABLE IF EXISTS "organova_post" CASCADE;--> statement-breakpoint
DROP TABLE IF EXISTS "organova_site_page" CASCADE;--> statement-breakpoint

-- 3) 清理 better-auth user 表的未使用列（phoneNumber plugin 未启用）
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_phone_number_unique') THEN
    ALTER TABLE "user" DROP CONSTRAINT "user_phone_number_unique";
  END IF;
END$$;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "phone_number";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "phone_number_verified";
