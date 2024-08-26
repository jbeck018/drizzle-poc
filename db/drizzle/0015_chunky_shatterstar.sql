CREATE TABLE IF NOT EXISTS "property_changes" (
	"id" serial PRIMARY KEY NOT NULL,
	"property_id" integer NOT NULL,
	"old_value" text,
	"new_value" text,
	"changed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_id_idx" ON "property_changes" USING btree ("property_id");

CREATE OR REPLACE FUNCTION track_property_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO property_changes (property_id, old_value, new_value)
        VALUES (
            OLD.id,
            COALESCE(OLD.text_value, OLD.date_value::text, OLD.boolean_value::text, OLD.number_value::text),
            COALESCE(NEW.text_value, NEW.date_value::text, NEW.boolean_value::text, NEW.number_value::text)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER property_changes_trigger
AFTER UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION track_property_changes();

CREATE OR REPLACE FUNCTION delete_property_changes()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM property_changes WHERE property_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delete_property_changes_trigger
BEFORE DELETE ON properties
FOR EACH ROW
EXECUTE FUNCTION delete_property_changes();