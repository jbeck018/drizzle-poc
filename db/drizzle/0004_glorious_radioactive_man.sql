DO $$ BEGIN
 CREATE TYPE "public"."propertyType" AS ENUM('text', 'date', 'boolean', 'number');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."recordType" AS ENUM('account', 'user', 'contact', 'opportunity', 'task', 'ticket');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"property_type" "propertyType" NOT NULL,
	"text_value" varchar(255),
	"date_value" timestamp,
	"boolean_value" boolean,
	"number_value" numeric(30, 2),
	"record_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"record_type" "recordType" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "events" RENAME COLUMN "eventType" TO "event_type";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "firstName" TO "first_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "lastName" TO "last_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "phoneNumber" TO "phone_number";--> statement-breakpoint
DROP INDEX IF EXISTS "user_event_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "first_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "last_name_idx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_type_idx" ON "properties" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_id_idx" ON "properties" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_type_idx" ON "records" USING btree ("record_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_event_idx" ON "events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first_name_idx" ON "users" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_name_idx" ON "users" USING btree ("last_name");