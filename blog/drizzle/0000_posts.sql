CREATE TABLE "posts" (
	"slug" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"cover" text,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL
);
