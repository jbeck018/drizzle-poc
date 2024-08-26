import { Price } from "#db/schema";

/**
 * Enumerates subscription plan names.
 * These are used as unique identifiers in both the database and Stripe dashboard.
 */
export const PLANS = {
	FREE: "free",
	PRO: "pro",
} as const;

export type Plan = (typeof PLANS)[keyof typeof PLANS];

/**
 * Enumerates billing intervals for subscription plans.
 */
export const INTERVALS = {
	MONTH: "month",
	YEAR: "year",
} as const;

export type Interval = (typeof INTERVALS)[keyof typeof INTERVALS];

/**
 * Enumerates supported currencies for billing.
 */
export const CURRENCIES = {
	DEFAULT: "usd",
	USD: "usd",
	EUR: "eur",
} as const;

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

/**
 * Defines the structure for each subscription plan.
 *
 * Note:
 * - Running the seed will create these plans in your Stripe Dashboard and populate the database.
 * - Each plan includes pricing details for each interval and currency.
 * - Plan IDs correspond to the Stripe plan IDs for easy identification.
 * - 'name' and 'description' fields are used in Stripe Checkout and client UI.
 */
export const PRICING_PLANS = {
	[PLANS.FREE]: {
		id: "16b794cd-74e6-4eed-97ad-abd30a210daf",
		name: "Free",
		description: "Start with the basics, upgrade anytime.",
		prices: {
			[INTERVALS.MONTH]: {
				[CURRENCIES.USD]: {
					price: 0,
					price_id: "fcdbd8ec-50c3-4635-adbc-395a420be255",
				},
				[CURRENCIES.EUR]: {
					price: 0,
					price_id: "cc85bc75-da12-4dd1-88bf-0fedab159403",
				},
			},
			[INTERVALS.YEAR]: {
				[CURRENCIES.USD]: {
					price: 0,
					price_id: "c13ef319-469d-4099-83de-f90d194160af",
				},
				[CURRENCIES.EUR]: {
					price: 0,
					price_id: "622bfa05-3202-4007-a46b-216e6149f0de",
				},
			},
		},
	},
	[PLANS.PRO]: {
		id: "1c2d22c7-7302-4c01-8866-12da71cf3e44",
		name: "Pro",
		description: "Access to all features and unlimited projects.",
		prices: {
			[INTERVALS.MONTH]: {
				[CURRENCIES.USD]: {
					price: 1990,
					price_id: "f0dd1077-c8ae-4e23-a2c9-0e4a405a81d7",
				},
				[CURRENCIES.EUR]: {
					price: 1990,
					price_id: "c1be9b16-e5f9-44f3-8230-344b65ee2059",
				},
			},
			[INTERVALS.YEAR]: {
				[CURRENCIES.USD]: {
					price: 19990,
					price_id: "1e572bfd-56b3-49ac-bae1-f338ab551be5",
				},
				[CURRENCIES.EUR]: {
					price: 19990,
					price_id: "8e49547c-799f-40f2-a723-56c2a8569283",
				},
			},
		},
	},
} satisfies PricingPlan;

/**
 * A type helper defining prices for each billing interval and currency.
 */
type PriceInterval<
	I extends Interval = Interval,
	C extends Currency = Currency,
> = {
	[interval in I]: {
		[currency in C]: {
			price: Price["amount"];
			price_id: Price["price_id"];
		};
	};
};

/**
 * A type helper defining the structure for subscription pricing plans.
 */
type PricingPlan<T extends Plan = Plan> = {
	[key in T]: {
		id: string;
		name: string;
		description: string;
		prices: PriceInterval;
	};
};
