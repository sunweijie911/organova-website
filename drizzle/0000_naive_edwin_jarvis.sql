CREATE TABLE "organova_admin_audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_email" text,
	"action" text NOT NULL,
	"input" jsonb,
	"result" text NOT NULL,
	"error_message" text,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organova_system_config" (
	"key" varchar(256) PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updatedAt" timestamp with time zone,
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"email_verified" boolean DEFAULT false,
	"image" text,
	"phone_number" text,
	"phone_number_verified" boolean,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "organova_cancer_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"slug" varchar(256) NOT NULL,
	"model_count" varchar(64),
	"formats" varchar(128),
	"cover_image" text,
	"subpage_title" varchar(512),
	"model_count_detail" text,
	"validation_methods" text,
	"validated_applications" text,
	"clinical_correlation" text,
	"cta1_label" varchar(128),
	"cta1_url" varchar(512),
	"cta2_label" varchar(128),
	"cta2_url" varchar(512),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "organova_cancer_type_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "organova_case_study" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(512) NOT NULL,
	"summary" text,
	"cover_image" text,
	"cancer_type_tags" text[] DEFAULT '{}' NOT NULL,
	"application_tags" text[] DEFAULT '{}' NOT NULL,
	"challenge" text,
	"approach" text,
	"results" text,
	"implication" text,
	"meta_model" text,
	"meta_drug_classes" text,
	"meta_readout" text,
	"meta_validation" text,
	"cta1_label" varchar(128),
	"cta1_url" varchar(512),
	"cta2_label" varchar(128),
	"cta2_url" varchar(512),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "organova_case_study_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "organova_faq_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organova_faq_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organova_lead" (
	"id" serial PRIMARY KEY NOT NULL,
	"source" varchar(32) NOT NULL,
	"status" varchar(32) DEFAULT 'new' NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"last_name" varchar(128) NOT NULL,
	"email" varchar(512) NOT NULL,
	"company" varchar(256),
	"job_title" varchar(256),
	"message" text,
	"cancer_type" varchar(256),
	"drug_modality" varchar(128),
	"study_type" varchar(128),
	"num_compounds" varchar(32),
	"turnaround" varchar(64),
	"phone" varchar(64),
	"additional_notes" text,
	"ip" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organova_news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(512) NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"location" varchar(256),
	"content" text,
	"cover_image" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organova_post" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(512) NOT NULL,
	"summary" text,
	"content" text DEFAULT '' NOT NULL,
	"cover_image" text,
	"status" varchar(32) DEFAULT 'draft' NOT NULL,
	"author_id" text NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "organova_post_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "organova_publication" (
	"id" serial PRIMARY KEY NOT NULL,
	"year" integer NOT NULL,
	"journal" varchar(256) NOT NULL,
	"title" text NOT NULL,
	"authors" varchar(512) NOT NULL,
	"citation_count" varchar(64),
	"doi" varchar(256),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organova_resource" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" text,
	"cta_label" varchar(128),
	"cta_type" varchar(32) DEFAULT 'download' NOT NULL,
	"file_url" text,
	"external_url" text,
	"is_visible" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organova_site_page" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(256) NOT NULL,
	"title" varchar(512) NOT NULL,
	"content" text DEFAULT '' NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "organova_site_page_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "organova_team_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"photo" text,
	"name" varchar(256) NOT NULL,
	"title" varchar(256) NOT NULL,
	"short_bio" text,
	"full_bio" text,
	"group" varchar(32) DEFAULT 'tricbio' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "organova_user_profile" (
	"user_id" text PRIMARY KEY NOT NULL,
	"display_name" varchar(256),
	"avatar" text,
	"bio" text,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organova_faq_item" ADD CONSTRAINT "organova_faq_item_category_id_organova_faq_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."organova_faq_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "organova_admin_audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_action_idx" ON "organova_admin_audit_log" USING btree ("action");--> statement-breakpoint
CREATE INDEX "cancer_type_slug_idx" ON "organova_cancer_type" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "cancer_type_published_idx" ON "organova_cancer_type" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "cancer_type_sort_idx" ON "organova_cancer_type" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "case_study_slug_idx" ON "organova_case_study" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "case_study_published_idx" ON "organova_case_study" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "case_study_sort_idx" ON "organova_case_study" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "faq_category_sort_idx" ON "organova_faq_category" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "faq_item_category_idx" ON "organova_faq_item" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "faq_item_sort_idx" ON "organova_faq_item" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "lead_source_idx" ON "organova_lead" USING btree ("source");--> statement-breakpoint
CREATE INDEX "lead_status_idx" ON "organova_lead" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lead_created_at_idx" ON "organova_lead" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "news_published_at_idx" ON "organova_news" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "news_is_published_idx" ON "organova_news" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "post_slug_idx" ON "organova_post" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_status_idx" ON "organova_post" USING btree ("status");--> statement-breakpoint
CREATE INDEX "post_published_at_idx" ON "organova_post" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "publication_year_idx" ON "organova_publication" USING btree ("year");--> statement-breakpoint
CREATE INDEX "publication_sort_idx" ON "organova_publication" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "resource_sort_idx" ON "organova_resource" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "site_page_slug_idx" ON "organova_site_page" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "team_member_group_idx" ON "organova_team_member" USING btree ("group");--> statement-breakpoint
CREATE INDEX "team_member_sort_idx" ON "organova_team_member" USING btree ("sort_order");