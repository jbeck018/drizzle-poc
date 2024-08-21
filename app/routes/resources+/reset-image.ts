import type { ActionFunctionArgs } from "@remix-run/router";
import { eq } from "drizzle-orm";
import { requireUser } from "#app/modules/auth/auth.server";
import { db } from "#db/db.server";
import { user_images } from "#db/schema";

export const ROUTE_PATH = "/resources/reset-image" as const;

export async function action({ request }: ActionFunctionArgs) {
	const user = await requireUser(request);
	await db.delete(user_images).where(eq(user_images.user_id, user.id));
	return null;
}
