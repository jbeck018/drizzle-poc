import { Flex } from '@chakra-ui/react'
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { z } from 'zod'
import { InnerNavigation } from '#app/components/navigations/inner-navigation'
import { requireUser } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as BILLING_PATH } from '#app/routes/dashboard+/settings.billing'

export const ROUTE_PATH = '/dashboard/settings' as const

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, 'Username may only contain alphanumeric characters.'),
})

export const meta: MetaFunction = () => {
  return [{ title: 'Settings' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  return json({ user })
}

const navItems = [
  {
    route: ROUTE_PATH,
    name: 'general',
  },
  {
    route: BILLING_PATH,
    name: 'billing',
  },
]

export default function DashboardSettings() {
  return (
    <Flex justifyContent={'start'}>
      <InnerNavigation title='Settings' items={[navItems]} />
      <Outlet />
    </Flex>
  )
}
