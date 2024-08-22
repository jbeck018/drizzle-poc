import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
// dashboard/index.tsx
import { authenticator } from "#app/modules/auth/auth.server";

export const ROUTE_PATH = '/' as const

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request)
  if (!sessionUser) {
    return redirect(`/auth/login`);
  }
};