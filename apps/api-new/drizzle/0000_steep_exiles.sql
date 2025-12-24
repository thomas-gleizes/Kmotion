CREATE TABLE "users" (
	"id" varchar(52) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_admin" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "musics" (
	"id" varchar(52) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"converter_id" integer NOT NULL,
	"media_id" varchar(255) NOT NULL,
	"media_source" varchar(255) NOT NULL,
	"downloader_id" varchar(52),
	"duration" integer NOT NULL,
	"thumbnail" varchar(255) NOT NULL,
	"audio" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "musics" ADD CONSTRAINT "musics_downloader_id_users_id_fk" FOREIGN KEY ("downloader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;