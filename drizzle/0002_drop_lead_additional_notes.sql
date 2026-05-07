-- 删除 lead 表的 additional_notes 列：RFQ 表单不再采集该字段。
-- IF EXISTS 保证幂等，未推送过 0000 的库不受影响。
ALTER TABLE "organova_lead" DROP COLUMN IF EXISTS "additional_notes";
