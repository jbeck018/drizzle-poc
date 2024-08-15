DO $$ BEGIN
 CREATE TYPE "public"."eventType" AS ENUM('page_view', 'click', 'bounce', 'logged_in', 'signed_up', 'subscribed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"content" text NOT NULL,
	"userId" integer NOT NULL,
	"eventType" "eventType"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"phoneNumber" numeric NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_event_idx" ON "events" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first_name_idx" ON "users" USING btree ("firstName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_name_idx" ON "users" USING btree ("lastName");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");