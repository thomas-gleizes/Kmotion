CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
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
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"converter_id" integer NOT NULL,
	"media_id" varchar(255) NOT NULL,
	"media_source" varchar(255) NOT NULL,
	"downloader_id" varchar(36),
	"duration" integer NOT NULL,
	"thumbnail" varchar(255) NOT NULL,
	"audio" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"visibility" varchar(255) NOT NULL,
	"user_id" varchar(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlist_entries" (
	"playlistId" varchar(36) NOT NULL,
	"musicId" varchar(36) NOT NULL,
	"position" smallint NOT NULL,
	CONSTRAINT "playlist_entries_playlistId_musicId_pk" PRIMARY KEY("playlistId","musicId")
);
--> statement-breakpoint
ALTER TABLE "musics" ADD CONSTRAINT "musics_downloader_id_users_id_fk" FOREIGN KEY ("downloader_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "playlists" ADD CONSTRAINT "playlists_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "playlist_entries" ADD CONSTRAINT "playlist_entries_playlistId_playlists_id_fk" FOREIGN KEY ("playlistId") REFERENCES "public"."playlists"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "playlist_entries" ADD CONSTRAINT "playlist_entries_musicId_musics_id_fk" FOREIGN KEY ("musicId") REFERENCES "public"."musics"("id") ON DELETE cascade ON UPDATE cascade;