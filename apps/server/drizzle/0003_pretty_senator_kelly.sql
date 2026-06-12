ALTER TABLE "users" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;
ALTER TABLE "users" ADD COLUMN "last_activity_at" timestamp with time zone;
