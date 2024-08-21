import { eq } from "drizzle-orm";
import { PLANS } from "#app/modules/stripe/plans";
import { stripe } from "#app/modules/stripe/stripe.server";
import { ERRORS } from "#app/utils/constants/errors";
import { HOST_URL, getLocaleCurrency } from "#app/utils/misc.server";
import { db } from "#db/db.server";
import { subscriptions, users } from "#db/schema";

/**
 * Creates a Stripe customer for a user.
 */
export async function createCustomer({ userId }: { userId: string }) {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
	});
	if (!user || user.customer_id)
		throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);

	const email = user.email ?? undefined;
	const name = user.username ?? undefined;
	const customer = await stripe.customers
		.create({ email, name })
		.catch((err: any) => console.error(err));
	if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);

	await db
		.update(users)
		.set({ customer_id: customer.id })
		.where(eq(users.id, user.id));
	return true;
}

/**
 * Creates a Stripe free tier subscription for a user.
 */
export async function createFreeSubscription({
	userId,
	request,
}: {
	userId: string;
	request: Request;
}) {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
	});
	if (!user || !user.customer_id)
		throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

	const subscription = await db.query.subscriptions.findFirst({
		where: (subscriptions, { eq }) => eq(subscriptions.user_id, user.id),
	});

	if (subscription) return false;

	const currency = getLocaleCurrency(request);

	const plan = await db.query.plans.findFirst({
		where: (plan, { eq }) => eq(plan.id, PLANS.FREE),
		with: {
			prices: true,
		},
	});

	const yearlyPrice = plan?.prices.find(
		(price) => price.interval === "year" && price.currency === currency,
	);
	if (!yearlyPrice) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

	const stripeSubscription = await stripe.subscriptions.create({
		customer: String(user.customer_id),
		items: [{ price: yearlyPrice.id }],
	});
	if (!stripeSubscription) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

	await db.insert(subscriptions).values({
		id: stripeSubscription.id,
		user_id: user.id,
		plan_id: String(stripeSubscription.items.data[0].plan.product),
		price_id: String(stripeSubscription.items.data[0].price.id),
		interval: String(stripeSubscription.items.data[0].plan.interval),
		status: stripeSubscription.status,
		current_period_start: stripeSubscription.current_period_start,
		current_period_end: stripeSubscription.current_period_end,
		cancel_at_period_end: stripeSubscription.cancel_at_period_end,
	});

	return true;
}

/**
 * Creates a Stripe checkout session for a user.
 */
export async function createSubscriptionCheckout({
	userId,
	plan_id,
	planInterval,
	request,
}: {
	userId: string;
	plan_id: string;
	planInterval: string;
	request: Request;
}) {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
	});
	if (!user || !user.customer_id)
		throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

	const subscription = await db.query.subscriptions.findFirst({
		where: (subscriptions, { eq }) => eq(subscriptions.user_id, user.id),
	});

	if (subscription?.plan_id !== PLANS.FREE) return;

	const currency = getLocaleCurrency(request);

	const plan = await db.query.plans.findFirst({
		where: (plans, { eq }) => eq(plans.id, plan_id),
		with: { prices: true },
	});

	const price = plan?.prices.find(
		(price) => price.interval === planInterval && price.currency === currency,
	);
	if (!price) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

	const checkout = await stripe.checkout.sessions.create({
		customer: user.customer_id,
		line_items: [{ price: price.id, quantity: 1 }],
		mode: "subscription",
		payment_method_types: ["card"],
		success_url: `${HOST_URL}/dashboard/checkout`,
		cancel_url: `${HOST_URL}/dashboard/settings/billing`,
	});
	if (!checkout) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
	return checkout.url;
}

/**
 * Creates a Stripe customer portal for a user.
 */
export async function createCustomerPortal({ userId }: { userId: string }) {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, userId),
	});
	if (!user || !user.customer_id)
		throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);

	const customerPortal = await stripe.billingPortal.sessions.create({
		customer: user.customer_id,
		return_url: `${HOST_URL}/dashboard/settings/billing`,
	});
	if (!customerPortal) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
	return customerPortal.url;
}
