import { Divider, Flex, Img } from '@chakra-ui/react';
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Link, Outlet } from '@remix-run/react'
import Logo from '#app/assets/logo_transparent.png'
import { authenticator } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as HOME_PATH } from '#app/routes/_home+/_index'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { getDomainPathname } from '#app/utils/misc.server'

export const ROUTE_PATH = '/auth' as const

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH,
  })
  const pathname = getDomainPathname(request)
  if (pathname === ROUTE_PATH) return redirect(LOGIN_PATH)
  return json({})
}

export default function Layout() {
  return (
    <Flex direction={'row'} alignItems={'center'} justifyContent={'start'} height={'100%'} width='100%'>
      <Flex 
        padding='10' 
        direction={'column'} 
        alignItems={'center'} 
        justifyContent='center' 
        height={'100%'} 
        maxWidth={600}
        background={'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)'}
      >
        <Link
          to={HOME_PATH}
          prefetch="intent"
        >
          <Img src={Logo} />
        </Link>
      </Flex>
      <Divider orientation='vertical' padding='10px' borderLeftWidth={2} height={'98%'} />
      <Outlet />
    </Flex>
  )
}
