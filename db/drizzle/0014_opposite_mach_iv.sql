CREATE OR REPLACE VIEW record_properties_json AS
SELECT
    record_id,
    jsonb_object_agg(
        key,
        CASE
            WHEN property_type = 'text' THEN to_jsonb(text_value)
            WHEN property_type = 'date' THEN to_jsonb(date_value)
            WHEN property_type = 'boolean' THEN to_jsonb(boolean_value)
            WHEN property_type = 'number' THEN to_jsonb(number_value)
        END
    ) AS properties
FROM properties
GROUP BY record_id;