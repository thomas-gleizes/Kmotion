ALTER TABLE "musics" ADD COLUMN "conversion_status" varchar(16) DEFAULT 'pending' NOT NULL;--> statement-breakpoint
-- Rows created before this migration were stored once converted, with their
-- audio path: they are ready. Rows without audio were never converted.
UPDATE "musics" SET "conversion_status" = CASE WHEN "audio" <> '' THEN 'ready' ELSE 'failed' END;
