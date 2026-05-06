-- 兼容补丁：早期通过 db:push 或旧版 better-auth 自动建表的库可能缺这两列。
-- IF NOT EXISTS 保证幂等，新建库不受影响。
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone_number" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "phone_number_verified" boolean DEFAULT false;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_phone_number_unique') THEN
    ALTER TABLE "user" ADD CONSTRAINT "user_phone_number_unique" UNIQUE ("phone_number");
  END IF;
END$$;
