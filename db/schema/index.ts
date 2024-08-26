import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
	boolean,
	customType,
	index,
	integer,
	numeric,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
	dataType() {
		return "bytea";
	},
});

// User Table
export const users = pgTable(
	"users",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		email: varchar("email", { length: 255 }).notNull(),
		username: varchar("username", { length: 255 }),
		customer_id: varchar("customer_id", { length: 255 }),
		first_name: text("first_name"),
		last_name: text("last_name"),
		phone_number: text("phone_number"),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		email_idx: uniqueIndex("email_idx").on(table.email),
		username_idx: uniqueIndex("username_idx").on(table.username),
		customer_id_idx: uniqueIndex("customer_id_idx").on(table.customer_id),
		first_name_idx: index("first_name_idx").on(table.first_name),
		last_name_idx: index("last_name_idx").on(table.last_name),
	}),
);

export const usersRelations = relations(users, ({ one, many }) => ({
	image: one(user_images, {
		fields: [users.id],
		references: [user_images.user_id],
	}),
	subscription: one(subscriptions, {
		fields: [users.id],
		references: [subscriptions.user_id],
	}),
	usersToRoles: many(usersToRoles),
	roles: many(usersToRoles),
}));

export const userSchema = createSelectSchema(users);
export type User = InferSelectModel<typeof users>;
export type CreateUser = InferInsertModel<typeof users>;

// User Image Table
export const user_images = pgTable(
	"user_images",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		alt_text: text("alt_text"),
		content_type: varchar("content_type", { length: 255 }).notNull(),
		blob: bytea("blob").notNull(),
		user_id: uuid("user_id").notNull(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		user_id_idx: uniqueIndex("user_id_idx").on(table.user_id),
	}),
);

export const userImageRelations = relations(user_images, ({ one }) => ({
	user: one(users, {
		references: [users.id],
		fields: [user_images.user_id],
	}),
}));

export const userImageSchema = createSelectSchema(user_images);
export type UserImage = InferSelectModel<typeof user_images>;
export type CreateUserImage = InferInsertModel<typeof user_images>;

// Role Table
export const roles = pgTable(
	"roles",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		description: text("description").default(""),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		name_idx: uniqueIndex("name_idx").on(table.name),
	}),
);

export const rolesRelations = relations(roles, ({ many }) => ({
	users: many(usersToRoles),
	usersToRoles: many(usersToRoles),
	rolesToPermissions: many(rolesToPermissions),
	permissions: many(rolesToPermissions),
}));

export const roleSchema = createSelectSchema(roles);
export type Role = InferSelectModel<typeof roles>;
export type CreateRole = InferInsertModel<typeof roles>;

//ROLES <> USERS MANY TO MANY TABLES:
export const usersToRoles = pgTable(
	"users_to_roles",
	{
		role_id: uuid("role_id")
			.notNull()
			.references(() => roles.id),
		user_id: uuid("user_id")
			.notNull()
			.references(() => users.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.role_id, t.user_id] }),
	}),
);

export const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
	permission: one(users, {
		fields: [usersToRoles.user_id],
		references: [users.id],
	}),
	role: one(roles, {
		fields: [usersToRoles.role_id],
		references: [roles.id],
	}),
}));

// Permission Table
export const permissions = pgTable(
	"permissions",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		entity: varchar("entity", { length: 255 }).notNull(),
		action: varchar("action", { length: 255 }).notNull(),
		access: varchar("access", { length: 255 }).notNull(),
		description: text("description").default(""),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		action_entity_access_idx: uniqueIndex("action_entity_access_idx").on(
			table.action,
			table.entity,
			table.access,
		),
	}),
);

export const permissionsRelations = relations(permissions, ({ many }) => ({
	rolesToPermissions: many(rolesToPermissions),
	roles: many(rolesToPermissions),
}));

export const permissionSchema = createSelectSchema(permissions);
export type Permission = InferSelectModel<typeof permissions>;
export type CreatePermission = InferInsertModel<typeof permissions>;

//ROLES <> PERMISSIONS MANY TO MANY TABLES:
export const rolesToPermissions = pgTable(
	"roles_to_permissions",
	{
		role_id: uuid("role_id")
			.notNull()
			.references(() => roles.id),
		permission_id: uuid("permission_id")
			.notNull()
			.references(() => permissions.id),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.role_id, t.permission_id] }),
	}),
);

export const rolesToPermissionsRelations = relations(
	rolesToPermissions,
	({ one }) => ({
		permission: one(permissions, {
			fields: [rolesToPermissions.permission_id],
			references: [permissions.id],
		}),
		role: one(roles, {
			fields: [rolesToPermissions.role_id],
			references: [roles.id],
		}),
	}),
);

// Plan Table
export const plans = pgTable("plans", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	description: text("description"),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const plansRelations = relations(plans, ({ many }) => ({
	subscriptions: many(subscriptions),
	prices: many(prices),
}));

export const planSchema = createSelectSchema(plans);
export type Plan = InferSelectModel<typeof plans>;
export type CreatePlan = InferInsertModel<typeof plans>;

// Price Table
export const prices = pgTable(
	"prices",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		plan_id: uuid("plan_id").notNull(),
		price_id: varchar("price_id", { length: 36 }).notNull(),
		amount: integer("amount").notNull(),
		currency: varchar("currency", { length: 255 }).notNull(),
		interval: varchar("interval", { length: 255 }).notNull(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		plan_id_idx: index("plan_id_idx").on(table.plan_id),
	}),
);

export const pricesRelations = relations(prices, ({ one, many }) => ({
	plan: one(plans, {
		fields: [prices.plan_id],
		references: [plans.id],
	}),
	subscriptions: many(subscriptions),
}));

export const priceSchema = createSelectSchema(prices);
export type Price = InferSelectModel<typeof prices>;
export type CreatePrice = InferInsertModel<typeof prices>;

// Subscription Table
export const subscriptions = pgTable(
	"subscriptions",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		user_id: uuid("user_id").notNull(),
		plan_id: uuid("plan_id").notNull(),
		price_id: uuid("price_id").notNull(),
		interval: varchar("interval", { length: 255 }).notNull(),
		status: varchar("status", { length: 255 }).notNull(),
		current_period_start: integer("current_period_start").notNull(),
		current_period_end: integer("current_period_end").notNull(),
		cancel_at_period_end: boolean("cancel_at_period_end").default(false),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => ({
		user_id__subscription_idx: uniqueIndex("user_id__subscription_idx").on(
			table.user_id,
		),
		subscription_plan_id_idx: index("subscription_plan_id_idx").on(
			table.plan_id,
		),
		price_id_idx: index("price_id_idx").on(table.price_id),
	}),
);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
	plan: one(plans, {
		fields: [subscriptions.plan_id],
		references: [plans.id],
	}),
	price: one(prices, {
		fields: [subscriptions.price_id],
		references: [prices.id],
	}),
}));

export const subscriptionSchema = createSelectSchema(subscriptions);
export type Subscription = InferSelectModel<typeof subscriptions>;
export type CreateSubscription = InferInsertModel<typeof subscriptions>;

// Record Type Enum
export const record_type_enum_values = [
	"account",
	"user",
	"contact",
	"opportunity",
	"task",
	"ticket",
] as const;
export const record_type_enum = pgEnum("record_type", record_type_enum_values);
export const record_type_zod_enum = z.enum(record_type_enum.enumValues);

// Records Table
export const records = pgTable(
	"records",
	{
		id: serial("id").primaryKey(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
		record_type: record_type_enum("record_type").notNull(),
	},
	(table) => ({
		record_type_idx: index("record_type_idx").on(table.record_type),
	}),
);

export const recordsRelations = relations(records, ({ many }) => ({
	properties: many(properties),
}));

export const recordsSchema = createSelectSchema(records);
export type Record = InferSelectModel<typeof records>;
export type CreateRecord = InferInsertModel<typeof records>;

// Property Type Enum
export const property_type_enum_values = [
	"text",
	"date",
	"boolean",
	"number",
] as const;
export const property_type_enum = pgEnum(
	"property_type",
	property_type_enum_values,
);
export const property_type_zod_enum = z.enum(property_type_enum.enumValues);

// Properties Table
export const properties = pgTable(
	"properties",
	{
		id: serial("id").primaryKey(),
		created_at: timestamp("created_at").notNull().defaultNow(),
		updated_at: timestamp("updated_at").notNull().defaultNow(),
		property_type: property_type_enum("property_type").notNull(),
		text_value: varchar("text_value", { length: 65535 }),
		date_value: timestamp("date_value", { withTimezone: false }),
		boolean_value: boolean("boolean_value"),
		number_value: numeric("number_value", { precision: 30, scale: 2 }),
		record_id: integer("record_id").notNull(),
		source: varchar("source", { length: 255 }),
		key: varchar("key", { length: 255 }),
	},
	(table) => ({
		property_type_idx: index("property_type_idx").on(table.property_type),
		record_id_idx: index("record_id_idx").on(table.record_id),
		key_idx: index("key_idx").on(table.key),
	}),
);

export const propertiesRelations = relations(properties, ({ one }) => ({
	record: one(records, {
		fields: [properties.record_id],
		references: [records.id],
	}),
}));

export const propertiesSchema = createSelectSchema(properties);
export type Property = InferSelectModel<typeof properties>;
export type CreateProperty = InferInsertModel<typeof properties>;