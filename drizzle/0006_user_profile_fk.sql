DELETE FROM "organova_user_profile" p
 WHERE NOT EXISTS (SELECT 1 FROM "user" u WHERE u.id = p."user_id");--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'organova_user_profile_user_id_user_id_fk'
  ) THEN
    ALTER TABLE "organova_user_profile"
      ADD CONSTRAINT "organova_user_profile_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION;
  END IF;
END$$;
