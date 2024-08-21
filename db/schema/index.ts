import { index, timestamp, text, pgTable, pgEnum, uniqueIndex, varchar, boolean, numeric, serial, integer } from 'drizzle-orm/pg-core';
import { relations, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  image: text('image'),
}, (table) => {
    return {
      firstNameIdx: index("first_name_idx").on(table.firstName),
      lastNameIdx: index("last_name_idx").on(table.lastName),
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  });

export const userSchema = createSelectSchema(users);
export type User = InferSelectModel<typeof users>;
export type CreateUser = InferInsertModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export const eventTypeEnumValues = ['page_view', 'click', 'bounce', 'logged_in', 'signed_up', 'subscribed'] as const;
export const eventType = pgEnum('eventType', eventTypeEnumValues);
export const eventTypeEnum = z.enum(eventType.enumValues);

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  content: text('content').notNull(),
  userId: integer('user_id').notNull(),
  eventType: eventType('event_type'),
  url: text('url'),
}, (table) => {
    return {
      userIdx: index("user_event_idx").on(table.userId),
    };
  });

export const eventsSchema = createSelectSchema(events);
export type Event = InferSelectModel<typeof events>;
export type CreateEvent = InferInsertModel<typeof events>;

export const eventsRelation = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
}));

export const recordTypeEnumValues = ['account', 'user', 'contact', 'opportunity', 'task', 'ticket'] as const;
export const recordType = pgEnum('recordType', recordTypeEnumValues);
export const recordTypeEnum = z.enum(recordType.enumValues);

export const records = pgTable('records', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  recordType: recordType('record_type').notNull(),
}, (table) => {
  return {
    recordTypeIdx: index("record_type_idx").on(table.recordType),
  };
});

export const recordsSchema = createSelectSchema(records);
export type Record = InferSelectModel<typeof records>;
export type CreateRecord = InferInsertModel<typeof records>;

export const recordsRelations = relations(records, ({ many }) => ({
  properties: many(properties),
}));

export const propertyTypeEnumValues = ['text', 'date', 'boolean', 'number'] as const;
export const propertyType = pgEnum('propertyType', propertyTypeEnumValues);
export const propertyTypeEnum = z.enum(propertyType.enumValues);

export const properties = pgTable('properties', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  propertyType: propertyType('property_type').notNull(),
  textValue: varchar('text_value', { length: 65535 }),
  dateValue: timestamp('date_value', { withTimezone: false }),
  booleanValue: boolean('boolean_value'),
  numberValue: numeric('number_value', { precision: 30, scale: 2 }),
  recordId: integer('record_id').notNull(),
  source: varchar('source', { length: 255 }),
  key: varchar('key', { length: 255 }),
}, (table) => {
  return {
    propertyTypeIdx: index("property_type_idx").on(table.propertyType),
    recordIdIdx: index("record_id_idx").on(table.recordId),
    keyIdx: index("key_idx").on(table.key),
  };
});

export const propertiesSchema = createSelectSchema(properties);
export type Property = InferSelectModel<typeof properties>;
export type CreateProperty = InferInsertModel<typeof properties>;

export const propertiesRelations = relations(properties, ({ one }) => ({
  record: one(records, { fields: [properties.recordId], references: [records.id] }),
}));