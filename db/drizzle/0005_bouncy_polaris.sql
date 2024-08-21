ALTER TABLE "properties" ALTER COLUMN "text_value" SET DATA TYPE varchar(65535);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "source" varchar(255);--> statement-breakpoint
ALTER TABLE "properties" ADD COLUMN "key" varchar(255);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "key_idx" ON "properties" USING btree ("key");