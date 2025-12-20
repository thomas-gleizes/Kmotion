CREATE TABLE "users" (
	"id" varchar(52) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"isAdmin" boolean DEFAULT false,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_slug_unique" UNIQUE("slug")
);
