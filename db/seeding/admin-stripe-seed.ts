import { Interval, PRICING_PLANS } from "#app/modules/stripe/plans";
import { stripe } from "#app/modules/stripe/stripe.server";
import { db } from "../db.server";
import { permissions, plans, roles, users } from "../schema";

async function seed() {
	/**
	 * Users, Roles, and Permissions.
	 */
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

	const allPermissions = await db.select().from(permissions).all();

	const adminPermissions = allPermissions
		.filter((p) => p.access === "any")
		.map((p) => p.id);
	const userPermissions = allPermissions
		.filter((p) => p.access === "own")
		.map((p) => p.id);

	await db.insert(roles).values({
		name: "admin",
		permissions: { connect: adminPermissions.map((id: string) => ({ id })) },
	});

	await db.insert(roles).values({
		name: "user",
		permissions: { connect: userPermissions.map((id: string) => ({ id })) },
	});

	await db.insert(users).values({
		email: "admin@admin.com",
		username: "admin",
		roles: { connect: [{ name: "admin" }, { name: "user" }] },
	});

	console.info(`🎭 User roles and permissions have been successfully created.`);

	/**
	 * Stripe Products.
	 */
	const products = await stripe.products.list({ limit: 3 });
	if (products?.data?.length) {
		console.info("🏃‍♂️ Skipping Stripe products creation and seeding.");
		return true;
	}

	const seedProducts = Object.values(PRICING_PLANS).map(
		async ({ id, name, description, prices }) => {
			const pricesByInterval = Object.entries(prices).flatMap(
				([interval, price]) =>
					Object.entries(price).map(([currency, amount]) => ({
						interval,
						currency,
						amount,
					})),
			);

			await stripe.products.create({
				id,
				name,
				description: description || undefined,
			});

			const stripePrices = await Promise.all(
				pricesByInterval.map((price) =>
					stripe.prices.create({
						product: id,
						currency: price.currency ?? "usd",
						unit_amount: price.amount ?? 0,
						tax_behavior: "inclusive",
						recurring: {
							interval: (price.interval as Interval) ?? "month",
						},
					}),
				),
			);

			await db.insert(plans).values({
				id,
				name,
				description,
				prices: {
					create: stripePrices.map((price: (typeof stripePrices)[number]) => ({
						id: price.id,
						amount: price.unit_amount ?? 0,
						currency: price.currency,
						interval: price.recurring?.interval ?? "month",
					})),
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

seed().catch((err: unknown) => {
	console.error(err);
	process.exit(1);
});
