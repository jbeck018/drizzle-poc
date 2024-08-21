DO $$ BEGIN
 CREATE TYPE "public"."property_type" AS ENUM('text', 'date', 'boolean', 'number');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."record_type" AS ENUM('account', 'user', 'contact', 'opportunity', 'task', 'ticket');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity" varchar(255) NOT NULL,
	"action" varchar(255) NOT NULL,
	"access" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plan_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(255) NOT NULL,
	"interval" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "properties" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"property_type" "property_type" NOT NULL,
	"text_value" varchar(65535),
	"date_value" timestamp,
	"boolean_value" boolean,
	"number_value" numeric(30, 2),
	"record_id" integer NOT NULL,
	"source" varchar(255),
	"key" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "records" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"record_type" "record_type" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"price_id" uuid NOT NULL,
	"interval" varchar(255) NOT NULL,
	"status" varchar(255) NOT NULL,
	"current_period_start" integer NOT NULL,
	"current_period_end" integer NOT NULL,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"alt_text" text,
	"content_type" varchar(255) NOT NULL,
	"blob" "bytea" NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE IF EXISTS "admins";--> statement-breakpoint
DROP TABLE IF EXISTS "events";--> statement-breakpoint
DROP INDEX IF EXISTS "first_name_idx";--> statement-breakpoint
DROP INDEX IF EXISTS "last_name_idx";--> statement-breakpoint
--> handle uuid creation:
-- Step 1: Add a new temporary UUID column
ALTER TABLE "users" ADD COLUMN "new_id" uuid DEFAULT gen_random_uuid();

-- Step 2: Populate the new UUID column with generated UUIDs for existing rows
UPDATE "users" SET "new_id" = gen_random_uuid();

-- Step 3: Drop constraints on the old "id" column (e.g., primary key constraints)
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_pkey";

-- Step 4: Drop the old "id" column
ALTER TABLE "users" DROP COLUMN "id";

-- Step 5: Rename the new UUID column to "id"
ALTER TABLE "users" RENAME COLUMN "new_id" TO "id";

-- Step 6: Add a new primary key constraint on the UUID column
ALTER TABLE "users" ADD PRIMARY KEY ("id");

-- Step 7: Set the default value for the new "id" column to generate UUIDs for new records
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
-- ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "username" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "first_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "phone_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "action_entity_access_idx" ON "permissions" USING btree ("action","entity","access");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "plan_id_idx" ON "prices" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_type_idx" ON "properties" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_id_idx" ON "properties" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "key_idx" ON "properties" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "record_type_idx" ON "records" USING btree ("record_type");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_idx" ON "roles" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id__subscription_idx" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_plan_id_idx" ON "subscriptions" USING btree ("plan_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_id_idx" ON "subscriptions" USING btree ("price_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_idx" ON "user_images" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "customer_id_idx" ON "users" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "first_name_idx" ON "users" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "last_name_idx" ON "users" USING btree ("last_name");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "createdAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updatedAt";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "firstName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "lastName";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "phoneNumber";