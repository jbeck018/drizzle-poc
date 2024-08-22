import { Button, Center, Input, Text } from '@chakra-ui/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { Inbox } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { z } from 'zod'
import { commitSession, getSession } from '#app/modules/auth/auth-session.server'
import { authenticator } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ROUTE_PATH as ONBOARDING } from '#app/routes/onboarding+/_layout';
import { siteConfig } from '#app/utils/constants/brand'
import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server';

export const ROUTE_PATH = '/auth/verify' as const

export const VerifyLoginSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters.'),
})

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Verify` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request)

  if (sessionUser) {
    if (sessionUser.username) {
      redirect(DASHBOARD_PATH);
    } else {
      redirect(ONBOARDING);
    }
  }

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(authenticator.sessionErrorKey)

  if (!authEmail) return redirect('/auth/login')

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
    successRedirect: pathname,
    failureRedirect: pathname,
  })
}

export default function Verify() {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useHydrated()

  const [codeForm, { code }] = useForm({
    constraint: getZodConstraint(VerifyLoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyLoginSchema })
    },
  })

  useEffect(() => {
    isHydrated && inputRef.current?.focus()
  }, [isHydrated])

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <Center className="mb-2 flex flex-col gap-2">
        <Inbox height={40} width={40} />
        <p className="text-center text-2xl text-primary">Check your inbox!</p>
        <p className="text-center text-base font-normal text-primary/60">
          We've just emailed you a temporary password.
          <br />
          Please enter it below.
        </p>
      </Center>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(codeForm)}>
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="code" className="sr-only">
            Code
          </label>
          <Input
            placeholder="Code"
            ref={inputRef}
            required
            className={`bg-transparent ${
              code.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getInputProps(code, { type: 'text' })}
          />
        </div>

        <div className="flex flex-col">
          {!authError && code.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {code.errors.join(' ')}
            </span>
          )}
          {authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </Form>

      {/* Request New Code. */}
      {/* Email is already in session, input it's not required. */}
      <Form method="POST" className="flex w-full flex-col">
        <AuthenticityTokenInput />
        <HoneypotInputs />
        <Center>
          <Text size={'xs'}>
            Did not receive the code?
          </Text>
        </Center>
        <Button type="submit" variant="ghost">
          Request New Code
        </Button>
      </Form>
    </div>
  )
}
