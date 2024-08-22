import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "#app/modules/auth/auth.server";
// dashboard/index.tsx
import { ROUTE_PATH as DASHBOARD } from "../dashboard+/_layout";
import { ROUTE_PATH as ONBOARDING } from '../onboarding+/username';

export const ROUTE_PATH = '/' as const

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request)
  if (!sessionUser) {
    return redirect(`/auth/login`);
  }

  if (sessionUser.username) {
    return redirect(DASHBOARD)
  } else {
    return redirect(ONBOARDING);
  }
};