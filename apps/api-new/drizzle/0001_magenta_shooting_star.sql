CREATE TABLE "musics" (
	"id" varchar(52) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"mediaId" varchar(255) NOT NULL,
	"mediaSource" varchar(255) NOT NULL,
	"downloaderId" varchar(52) NOT NULL,
	"duration" integer NOT NULL,
	"thumbnail" varchar(255) NOT NULL
);
