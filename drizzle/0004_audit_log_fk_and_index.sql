-- 审计日志: user_id 加 FK 到 user 表，ON DELETE SET NULL 保留删除用户的审计痕迹
ALTER TABLE "organova_admin_audit_log" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint

-- 加 FK 前先清理孤儿引用：历史数据 / 已删除用户 / 测试残留可能让 user_id
-- 指向不存在的 user.id，直接 ADD CONSTRAINT 会因 FK 违反导致迁移失败。
UPDATE "organova_admin_audit_log" SET "user_id" = NULL
 WHERE "user_id" IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM "user" u WHERE u.id = "organova_admin_audit_log"."user_id");--> statement-breakpoint

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'organova_admin_audit_log_user_id_user_id_fk'
  ) THEN
    ALTER TABLE "organova_admin_audit_log"
      ADD CONSTRAINT "organova_admin_audit_log_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
  END IF;
END$$;--> statement-breakpoint

-- user_email 高频过滤字段加索引
CREATE INDEX IF NOT EXISTS "audit_log_user_email_idx"
  ON "organova_admin_audit_log" USING btree ("user_email");
