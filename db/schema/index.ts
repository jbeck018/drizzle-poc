import { integer, index, timestamp, numeric, serial, text, pgTable, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  email: text('email').notNull(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  phoneNumber: text('phoneNumber').notNull(),
}, (table) => {
    return {
      firstNameIdx: index("first_name_idx").on(table.firstName),
      lastNameIdx: index("last_name_idx").on(table.lastName),
      emailIdx: uniqueIndex("email_idx").on(table.email),
    };
  });

const userSchema = createSelectSchema(users);
export type User = z.infer<typeof userSchema>;

export const usersRelations = relations(users, ({ many }) => ({
  events: many(events),
}));

export const eventTypeEnumValues = ['page_view', 'click', 'bounce', 'logged_in', 'signed_up', 'subscribed'] as const;
export const eventType = pgEnum('eventType', eventTypeEnumValues);
export const eventTypeEnum = z.enum(eventType.enumValues);

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  content: text('content').notNull(),
  userId: integer('userId').notNull(),
  eventType: eventType('eventType'),
  url: text('url'),
}, (table) => {
    return {
      userIdx: index("user_event_idx").on(table.userId),
    };
  });

const eventsSchema = createSelectSchema(events);
export type Event = z.infer<typeof eventsSchema>;

export const eventsRelation = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] }),
}));