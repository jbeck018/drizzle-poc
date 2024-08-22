import { redirect } from "@remix-run/node";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { TOTPStrategy } from "remix-auth-totp";
import { db } from "#db/db.server";
import { CreateUser, User, users } from "#db/schema";
import { ROUTE_PATH as LOGOUT_PATH } from "../../routes/auth+/logout";
import { ROUTE_PATH as MAGIC_LINK_PATH } from "../../routes/auth+/magic-link";
import { ERRORS } from "../../utils/constants/errors";
import { HOST_URL } from "../../utils/misc.server";
import { sendAuthEmail } from "../email/templates/auth-email";
import { authSessionStorage } from "./auth-session.server";

export const authenticator = new Authenticator<User>(authSessionStorage);
/**
 * TOTP - Strategy.
 */
authenticator.use(
	new TOTPStrategy(
		{
			secret: process.env.ENCRYPTION_SECRET || "NOT_A_STRONG_SECRET",
			magicLinkPath: MAGIC_LINK_PATH,
			sendTOTP: async ({ email, code, magicLink }) => {
				if (process.env.NODE_ENV === "development") {
					// Development Only: Log the TOTP code.
					console.log("[ Dev-Only ] TOTP Code:", code);

					// Email is not sent for admin users.
					if (email.startsWith("admin")) {
						console.log("Not sending email for admin user.");
						return;
					}
				}
				await sendAuthEmail({ email, code, magicLink });
			},
		},
		async ({ email }) => {
			let user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (!user) {
				user = (await db
					.insert(users)
					.values({
						email,
					} as CreateUser)
					.returning()) as any;
				if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
			}

			return user;
		},
	),
);

/**
 * Github - Strategy.
 */
authenticator.use(
	new GitHubStrategy(
		{
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
			redirectURI: `${HOST_URL}/auth/github/callback`,
		},
		async ({ profile }) => {
			const email = profile._json.email || profile.emails[0].value;
			let user = await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.email, email),
			});

			if (!user) {
				user = (await db
					.insert(users)
					.values({
						roles: { connect: [{ name: "user" }] },
						email,
					} as any)
					.returning()) as any;
				if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
			}

			return user;
		},
	),
);

/**
 * Utilities.
 */
export async function requireSessionUser(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const sessionUser = await authenticator.isAuthenticated(request);
	if (!sessionUser) {
		if (!redirectTo) throw redirect(LOGOUT_PATH);
		else throw redirect(redirectTo);
	}
	return sessionUser;
}

export async function requireUser(
	request: Request,
	{ redirectTo }: { redirectTo?: string | null } = {},
) {
	const sessionUser = await authenticator.isAuthenticated(request);
	const user = sessionUser?.id
		? await db.query.users.findFirst({
				where: (users, { eq }) => eq(users.id, sessionUser?.id),
				with: {
					image: true,
				},
			})
		: null;
	if (!user) {
		if (!redirectTo) throw redirect(LOGOUT_PATH);
		else throw redirect(redirectTo);
	}
	return user;
}
