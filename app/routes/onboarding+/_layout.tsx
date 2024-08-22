import { Divider, Flex, Image } from '@chakra-ui/react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import Logo from '#app/assets/logo_transparent.png'
import { requireUser } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ROUTE_PATH as ONBOARDING_USERNAME_PATH } from '#app/routes/onboarding+/username'
import { getDomainPathname } from '#app/utils/misc.server'

export const ROUTE_PATH = '/onboarding' as const

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)

  const pathname = getDomainPathname(request)
  const isOnboardingPathname = pathname === ROUTE_PATH
  const isOnboardingUsernamePathname = pathname === ONBOARDING_USERNAME_PATH

  if (isOnboardingPathname && !user.username) return redirect(ONBOARDING_USERNAME_PATH)
  if (user.username && isOnboardingUsernamePathname) return redirect(DASHBOARD_PATH)

  return json({})
}

export default function Onboarding() {
  return (
    <Flex width='100vw' height='100vh' direction={'row'} alignItems={'center'} justifyContent={'start'}>
      <Flex 
        padding='10' 
        direction={'column'} 
        alignItems={'center'} 
        justifyContent='center' 
        height={'100%'} 
        maxWidth={600}
        background={'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)'}
      >
        <Image src={Logo} />
      </Flex>
      <Divider orientation='vertical' padding='10px' borderLeftWidth={2} height={'98%'} />
      <Outlet />
    </Flex>
  )
}
