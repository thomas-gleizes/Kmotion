CREATE TABLE "favorites" (
	"user_id" varchar(36) NOT NULL,
	"music_id" varchar(36) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "favorites_user_id_music_id_pk" PRIMARY KEY("user_id","music_id")
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_music_id_musics_id_fk" FOREIGN KEY ("music_id") REFERENCES "public"."musics"("id") ON DELETE cascade ON UPDATE cascade;