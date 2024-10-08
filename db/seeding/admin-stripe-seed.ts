import Stripe from "stripe";
import { Interval, PRICING_PLANS } from "../../app/modules/stripe/plans";
import { stripe } from "../../app/modules/stripe/stripe.server";
import { db } from "../db.server";
import {
	permissions,
	plans,
	prices as pricesTable,
	roles,
	users,
} from "../schema";
import { rolesToPermissions, usersToRoles } from "./../schema/index";
import { sql } from "drizzle-orm";

export async function seedUserAndStripe() {
	let allPermissions = await db.query.permissions.findMany();

	/**
	 * Users, Roles, and Permissions.
	 */
	if (allPermissions.length === 0) {
		const entities = ["user"];
		const actions = ["create", "read", "update", "delete"];
		const accesses = ["own", "any"] as const;

		for (const entity of entities) {
			for (const action of actions) {
				for (const access of accesses) {
					await db.insert(permissions).values({ entity, action, access });
				}
			}
		}

		allPermissions = await db.query.permissions.findMany();

		const adminPermissions = allPermissions
			.filter((p) => p.access === "any")
			.map((p) => p.id);

		const userPermissions = allPermissions
			.filter((p) => p.access === "own")
			.map((p) => p.id);

		const adminRole = await db
			.insert(roles)
			.values({ name: "admin" })
			.returning();

		await Promise.all(
			adminPermissions.map(
				async (id: string) =>
					await db.insert(rolesToPermissions).values({
						role_id: adminRole[0]?.id,
						permission_id: id,
					}),
			),
		);

		const userRole = await db
			.insert(roles)
			.values({ name: "user" })
			.returning();

		await Promise.all(
			userPermissions.map(
				async (id: string) =>
					await db.insert(rolesToPermissions).values({
						role_id: userRole[0]?.id,
						permission_id: id,
					}),
			),
		);

		const user = await db
			.insert(users)
			.values({
				email: "admin@admin.com",
				username: "admin",
			})
			.returning();

		await db.insert(usersToRoles).values([
			{ user_id: user?.[0].id, role_id: adminRole?.[0].id },
			{ user_id: user?.[0].id, role_id: userRole?.[0].id },
		]);
	}

	console.info(`🎭 User roles and permissions have been successfully created.`);

	/**
	 * Stripe Products.
	 */
	const stripeProducts = await stripe.products.list({ limit: 10 });
	const products = stripeProducts?.data;

	const seedProducts = Object.values(PRICING_PLANS).map(
		async ({ id, name, description, prices }) => {
			const pricesByInterval = Object.entries(prices).flatMap(
				([interval, price]) =>
					Object.entries(price).map(([currency, { price: amount, price_id }]) => ({
						interval,
						currency,
						amount,
						price_id,
					})),
			);

			const pricesFromStripe = await stripe.prices.search({
				query: `product:"${id}"`,
			});

			let stripePrices: Stripe.Price[] = pricesFromStripe.data;

			const alreadyExists = products.find((p) => p.id === id);
			if (!alreadyExists) {
				await stripe.products.create({
					id,
					name,
					description: description || undefined,
				});

				stripePrices = await Promise.all(
					pricesByInterval.map(async (price) => {
						const stripePrice = await stripe.prices.create({
							product: id,
							currency: price.currency ?? "usd",
							unit_amount: price.amount ?? 0,
							tax_behavior: "inclusive",
							recurring: {
								interval: (price.interval as Interval) ?? "month",
							},
							metadata: {
								price_id: price.price_id,
							}
						});
						return stripePrice;
					}),
				);

			}

			const plan = await db
				.insert(plans)
				.values({
					id,
					name,
					description,
				})
				.onConflictDoUpdate({
					target: plans.id,
					set: {
						name,
						description,
					},
				})
				.returning();

			await db.insert(pricesTable).values(
				stripePrices.map((price: (typeof stripePrices)[number]) => ({
					id: price.metadata?.price_id,
					price_id: price.id,
					amount: price.unit_amount ?? 0,
					currency: price.currency,
					interval: price.recurring?.interval ?? "month",
					plan_id: plan?.[0]?.id,
				}))
			).onConflictDoUpdate({
				target: pricesTable.id,
				set: {
					price_id: sql`EXCLUDED.price_id`,
					amount: sql`EXCLUDED.amount`,
					currency: sql`EXCLUDED.currency`,
					interval: sql`EXCLUDED.interval`,
					plan_id: sql`EXCLUDED.plan_id`,
				},
			});

			return {
				product: id,
				prices: stripePrices.map(
					(price: (typeof stripePrices)[number]) => price.id,
				),
			};
			},
		);

	const seededProducts = await Promise.all(seedProducts);
	console.info(`📦 Stripe Products have been successfully created.`);

	// Configure Customer Portal
	await stripe.billingPortal.configurations.create({
		business_profile: {
			headline: "FunnelIntelligence - Customer Portal",
		},
		features: {
			customer_update: {
				enabled: true,
				allowed_updates: ["address", "shipping", "tax_id", "email"],
			},
			invoice_history: { enabled: true },
			payment_method_update: { enabled: true },
			subscription_cancel: { enabled: true },
			subscription_update: {
				enabled: true,
				default_allowed_updates: ["price"],
				proration_behavior: "always_invoice",
				products: seededProducts.filter(({ product }) => product !== "free"),
			},
		},
	});

	console.info(`👒 Stripe Customer Portal has been successfully configured.`);
	console.info(
		"🎉 Visit: https://dashboard.stripe.com/test/products to see your products.",
	);
}