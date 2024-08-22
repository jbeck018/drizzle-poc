import { AbsoluteCenter, Box, Button, Center, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { z } from 'zod'
import { Icon } from '#app/assets/icons'
import { commitSession, getSession } from '#app/modules/auth/auth-session.server'
import { authenticator } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as AUTH_VERIFY_PATH } from '#app/routes/auth+/verify'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { siteConfig } from '#app/utils/constants/brand'
import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { useIsPending } from '#app/utils/misc'

export const ROUTE_PATH = '/auth/login' as const

export const LoginSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.'),
})

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Login` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH,
  })

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(authenticator.sessionErrorKey)

  return json({ authEmail, authError } as const, {
    headers: {
      'Set-Cookie': await commitSession(cookie),
    },
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  await authenticator.authenticate('TOTP', request, {
    successRedirect: AUTH_VERIFY_PATH,
    failureRedirect: pathname,
  })
}

export default function Login() {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useHydrated()
  const isPending = useIsPending()

  const [emailForm, { email }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema })
    },
  })

  useEffect(() => {
    isHydrated && inputRef.current?.focus()
  }, [isHydrated])

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <Center display={'flex'} alignContent={'center'} flexDir={'column'} gap={5}>
        <Heading as={'h3'} size='lg'>
          Welcome back!
        </Heading>
        <Text>Please log in to continue.</Text>
      </Center>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(emailForm)}>
        {/* Security */}
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            placeholder="Email"
            ref={inputRef}
            defaultValue={authEmail ? authEmail : ''}
            {...getInputProps(email, { type: 'email' })}
          />
        </div>

        <div className="flex flex-col">
          {!authError && email.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {email.errors.join(' ')}
            </span>
          )}
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div>

        <Button type="submit" width='100%' disabled={!email}>
          {isPending ? <Loader2 className="animate-spin" /> : 'Continue with Email'}
        </Button>
      </Form>

      <div className="relative flex w-full items-center justify-center">
        <span className="absolute w-full border-b border-border" />
        <Box position='relative' padding='10' wordBreak={'keep-all'}>
          <Divider />
          <AbsoluteCenter bg='white' px='4' overflow={'unset'}>
            Or
          </AbsoluteCenter>
        </Box>
      </div>

      <Form action={`/auth/github`} method="POST" className="w-full">
        <Button variant="outline" width='100%' display='flex' gap={2}>
          <Icon.Github />
          Github
        </Button>
      </Form>

      <p className="px-12 text-center text-sm font-normal leading-normal text-primary/60">
        By clicking continue, you agree to our{' '}
        <a href="/" className="underline hover:text-primary">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/" className="underline hover:text-primary">
          Privacy Policy.
        </a>
      </p>
    </div>
  )
}
