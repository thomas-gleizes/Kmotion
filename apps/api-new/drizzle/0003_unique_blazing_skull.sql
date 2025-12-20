ALTER TABLE "users" RENAME COLUMN "isAdmin" TO "is_admin";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "musics" RENAME COLUMN "mediaId" TO "media_id";--> statement-breakpoint
ALTER TABLE "musics" RENAME COLUMN "mediaSource" TO "media_source";--> statement-breakpoint
ALTER TABLE "musics" RENAME COLUMN "downloaderId" TO "downloader_id";--> statement-breakpoint
ALTER TABLE "musics" DROP CONSTRAINT "musics_downloaderId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "musics" ADD CONSTRAINT "musics_downloader_id_users_id_fk" FOREIGN KEY ("downloader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;