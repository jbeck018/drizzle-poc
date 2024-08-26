ALTER TABLE "property_changes" RENAME COLUMN "old_value" TO "old_text_value";--> statement-breakpoint
ALTER TABLE "property_changes" RENAME COLUMN "new_value" TO "new_text_value";--> statement-breakpoint
ALTER TABLE "property_changes" ALTER COLUMN "old_text_value" SET DATA TYPE varchar(65535);--> statement-breakpoint
ALTER TABLE "property_changes" ALTER COLUMN "new_text_value" SET DATA TYPE varchar(65535);--> statement-breakpoint
ALTER TABLE "property_changes" ADD COLUMN "old_date_value" timestamp;--> statement-breakpoint
ALTER TABLE "property_changes" ADD COLUMN "new_date_value" timestamp;--> statement-breakpoint
ALTER TABLE "property_changes" ADD COLUMN "old_boolean_value" boolean;--> statement-breakpoint
ALTER TABLE "property_changes" ADD COLUMN "new_boolean_value" boolean;--> statement-breakpoint
ALTER TABLE "property_changes" ADD COLUMN "old_number_value" numeric(30, 2);--> statement-breakpoint
ALTER TABLE "property_changes" ADD COLUMN "new_number_value" numeric(30, 2);

CREATE OR REPLACE FUNCTION track_property_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO property_changes (
            property_id,
            old_text_value,
            new_text_value,
            old_date_value,
            new_date_value,
            old_boolean_value,
            new_boolean_value,
            old_number_value,
            new_number_value
        )
        VALUES (
            OLD.id,
            OLD.text_value,
            NEW.text_value,
            OLD.date_value,
            NEW.date_value,
            OLD.boolean_value,
            NEW.boolean_value,
            OLD.number_value,
            NEW.number_value
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;