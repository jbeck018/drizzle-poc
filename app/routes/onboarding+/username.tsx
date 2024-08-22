import { Button, Center, Flex, Input, Text } from '@chakra-ui/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import styled from '@emotion/styled';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { useHydrated } from 'remix-utils/use-hydrated'
import { z } from 'zod'
import { requireSessionUser } from '#app/modules/auth/auth.server'
import {
  createCustomer,
  createFreeSubscription,
} from '#app/modules/stripe/queries.server'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ERRORS } from '#app/utils/constants/errors'
import { validateCSRF } from '#app/utils/csrf.server'
import { db } from '#app/utils/db.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { useIsPending } from '#app/utils/misc'
import { users } from '#db/schema'

export const ROUTE_PATH = '/onboarding/username' as const

const StyledFrom = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  width: 100%;
`

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
  return [{ title: 'Remix SaaS - Username' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionUser(request, { redirectTo: LOGIN_PATH })
  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: LOGIN_PATH,
  })

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  const submission = parseWithZod(formData, { schema: UsernameSchema })
  if (submission.status !== 'success') {
    return json(submission.reply(), { status: submission.status === 'error' ? 400 : 200 })
  }

  const { username } = submission.value
  const isUsernameTaken = await db.query.users.findFirst({ where: (user, { eq }) => eq(user.username, username)});

  if (isUsernameTaken) {
    return json(
      submission.reply({
        fieldErrors: {
          username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS],
        },
      }),
    )
  }
  await db.update(users).set({ username }).where(eq(users.id, sessionUser.id ))
  await createCustomer({ userId: sessionUser.id })
  const subscription = await db.query.subscriptions.findFirst({
    where: (sub, {eq}) => eq(sub.user_id, sessionUser.id)
  })
  if (!subscription) await createFreeSubscription({ userId: sessionUser.id, request })

  return redirect(DASHBOARD_PATH)
}

export default function OnboardingUsername() {
  const lastResult = useActionData<typeof action>()
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useHydrated()
  const isPending = useIsPending()

  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema })
    },
  })

  useEffect(() => {
    isHydrated && inputRef.current?.focus()
  }, [isHydrated])

  return (
    <Flex width='100%' height='100%' direction='column' alignItems='center' justifyContent='center' gap={10}>
      <Flex direction='column' alignItems='start' maxWidth={600} gap={5}>
        <Flex direction='column' alignItems='start' gap={2}>
          <Center>
            <span className="mb-2 select-none text-6xl">👋</span>
          </Center>
          <Text as='h3' fontSize='2xl'>Welcome!</Text>
          <p>
            Let's get started by choosing a username.
          </p>
        </Flex>

        <StyledFrom
          method="POST"
          autoComplete="off"
          {...getFormProps(form)}
        >
          {/* Security */}
          <AuthenticityTokenInput />
          <HoneypotInputs />

          <Flex maxWidth={400} width='100%' direction='column' gap={5}>
            <label htmlFor="username" className="sr-only">
              Username
            </label>
            <Input
              style={{ width: '100%' }}
              placeholder="Username"
              autoComplete="off"
              ref={inputRef}
              required
              {...getInputProps(username, { type: 'text' })}
            />
          </Flex>

          <Flex maxWidth={400} direction='column'>
            {username.errors && (
              <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
                {username.errors.join(' ')}
              </span>
            )}
          </Flex>

          <Button type="submit" size="sm" width='100%' maxWidth={400}>
            {isPending ? <Loader2 className="animate-spin" /> : 'Continue'}
          </Button>
        </StyledFrom>

        <Text as='p' fontSize='small' style={{ maxWidth: 400, textOverflow: 'wrap' }}>
          You can update your username at any time from your account settings.
        </Text>
      </Flex>
    </Flex>
  )
}
