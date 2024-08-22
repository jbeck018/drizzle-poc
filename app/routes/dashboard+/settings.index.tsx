import { Box, Button, Container, Flex, Input, Text } from '@chakra-ui/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useFetcher, useLoaderData } from '@remix-run/react'
import { eq } from 'drizzle-orm'
import { Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { z } from 'zod'
import { destroySession, getSession } from '#app/modules/auth/auth-session.server'
import { requireUser } from '#app/modules/auth/auth.server'
import { ROUTE_PATH as HOME_PATH } from '#app/routes/_home+/_index'
import { ROUTE_PATH as RESET_IMAGE_PATH } from '#app/routes/resources+/reset-image'
import {
  ImageSchema,
  ROUTE_PATH as UPLOAD_IMAGE_PATH,
  type action as uploadImageAction,
} from '#app/routes/resources+/upload-image'
import { ERRORS } from '#app/utils/constants/errors'
import { INTENTS } from '#app/utils/constants/misc'
import { useDoubleCheck } from '#app/utils/hooks/use-double-check'
import { getUserImgSrc } from '#app/utils/misc'
import { createToastHeaders } from '#app/utils/toast.server'
import { db } from '#db/db.server'
import { users } from '#db/schema'

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, 'Username may only contain alphanumeric characters.'),
})

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request)
  const formData = await request.clone().formData()
  const intent = formData.get(INTENTS.INTENT)

  if (intent === INTENTS.USER_UPDATE_USERNAME) {
    const submission = parseWithZod(formData, { schema: UsernameSchema })
    if (submission.status !== 'success') {
      return json(submission.reply(), {
        status: submission.status === 'error' ? 400 : 200,
      })
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

    await db.update(users).set({ username }).where(eq(users.id, user.id ))
    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: 'Success!',
        description: 'Username updated successfully.',
      }),
    })
  }

  if (intent === INTENTS.USER_DELETE_ACCOUNT) {
    await db.delete(users).where(eq(users.id, user.id));
    return redirect(HOME_PATH, {
      headers: {
        'Set-Cookie': await destroySession(
          await getSession(request.headers.get('Cookie')),
        ),
      },
    })
  }

  throw new Error(`Invalid intent: ${intent}`)
}

export default function DashboardSettings() {
  const { user } = useLoaderData<typeof loader>()
  const lastResult = useActionData<typeof action>()

  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const imageFormRef = useRef<HTMLFormElement>(null)
  const uploadImageFetcher = useFetcher<typeof uploadImageAction>()
  const resetImageFetcher = useFetcher()

  const { doubleCheck, getButtonProps } = useDoubleCheck()

  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema })
    },
  })
  const [avatarForm, avatarFields] = useForm({
    lastResult: uploadImageFetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ImageSchema })
    },
  })

  return (
    <Box width={'100%'} display='flex' alignItems='center' justifyContent='center'>
      <Container>
        {/* Avatar */}
        <uploadImageFetcher.Form
          method="POST"
          action={UPLOAD_IMAGE_PATH}
          encType="multipart/form-data"
          ref={imageFormRef}
          onReset={() => setImageSrc(null)}
          {...getFormProps(avatarForm)}
        >
          <Flex width='100%' alignItems='start' justifyContent='space-between' padding={'20px'} border='1px solid' borderBottom='none' borderRadius={'4px 4px 0 0'}>
            <Flex direction='column' gap={2}>
              <Text as='h2' fontSize='2xl'>Your Avatar</Text>
              <Text>
                This is your avatar. It will be displayed on your profile.
              </Text>
            </Flex>
            <label
              htmlFor={avatarFields.imageFile.id}
              className="group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95">
              {imageSrc || user.image?.id ? (
                <img
                  src={imageSrc ?? getUserImgSrc(user.image?.id)}
                  className="h-20 w-20 rounded-full object-cover"
                  alt={user.username ?? user.email}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
              )}
              <div className="absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex">
                <Upload className="h-6 w-6 text-secondary" />
              </div>
            </label>
            <input
              {...getInputProps(avatarFields.imageFile, { type: 'file' })}
              accept="image/*"
              className="peer sr-only"
              required
              tabIndex={imageSrc ? -1 : 0}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0]
                if (file) {
                  const form = e.currentTarget.form
                  if (!form) return
                  const reader = new FileReader()
                  reader.onload = (readerEvent) => {
                    setImageSrc(readerEvent.target?.result?.toString() ?? null)
                    uploadImageFetcher.submit(form)
                  }
                  reader.readAsDataURL(file)
                }
              }}
            />
          </Flex>
          <Flex alignItems={'center'} justifyContent={'space-between'} border='1px solid' borderBottom='none' padding='10px 20px'>
            <p className="text-sm font-normal text-primary/60">
              Click on the avatar to upload a custom one from your files.
            </p>
            {user.image?.id && !avatarFields.imageFile.errors && (
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => {
                  resetImageFetcher.submit(
                    {},
                    {
                      method: 'POST',
                      action: RESET_IMAGE_PATH,
                    },
                  )
                  if (imageFormRef.current) {
                    imageFormRef.current.reset()
                  }
                }}>
                Reset
              </Button>
            )}
            {avatarFields.imageFile.errors && (
              <p className="text-right text-sm text-destructive dark:text-destructive-foreground">
                {avatarFields.imageFile.errors.join(' ')}
              </p>
            )}
          </Flex>
        </uploadImageFetcher.Form>

        {/* Username */}
        <Form
          method="POST"
          className="flex w-full flex-col items-start rounded-lg border border-border bg-card"
          {...getFormProps(form)}>
          <div className="flex w-full flex-col gap-4 rounded-lg p-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-medium text-primary">Your Username</h2>
              <p className="text-sm font-normal text-primary/60">
                This is your username. It will be displayed on your profile.
              </p>
            </div>
            <Input
              placeholder="Username"
              autoComplete="off"
              defaultValue={user?.username ?? ''}
              required
              className={`w-80 bg-transparent ${
                username.errors && 'border-destructive focus-visible:ring-destructive'
              }`}
              {...getInputProps(username, { type: 'text' })}
            />
            {username.errors && (
              <p className="text-sm text-destructive dark:text-destructive-foreground">
                {username.errors.join(' ')}
              </p>
            )}
          </div>
          <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card">
            <p className="text-sm font-normal text-primary/60">
              Please use 32 characters at maximum.
            </p>
            <Button
              type="submit"
              size="sm"
              name={INTENTS.INTENT}
              value={INTENTS.USER_UPDATE_USERNAME}>
              Save
            </Button>
          </div>
        </Form>

        {/* Delete Account */}
        <Flex direction='column' alignItems='start' border='1px solid' borderTop='none' borderRadius={'0 0 4px 4px'}>
          <div className="flex flex-col gap-2 p-6">
            <h2 className="text-xl font-medium text-primary">Delete Account</h2>
            <p className="text-sm font-normal text-primary/60">
              Permanently delete your Remix SaaS account, all of your projects, links and
              their respective stats.
            </p>
          </div>
          <div className="flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-red-500/10 px-6 dark:bg-red-500/10">
            <p className="text-sm font-normal text-primary/60">
              This action cannot be undone, proceed with caution.
            </p>
            <Form method="POST">
              <Button
                type="submit"
                size="sm"
                variant="destructive"
                name={INTENTS.INTENT}
                value={INTENTS.USER_DELETE_ACCOUNT}
                {...getButtonProps()}>
                {doubleCheck ? 'Are you sure?' : 'Delete Account'}
              </Button>
            </Form>
          </div>
        </Flex>
      </Container>
    </Box>
  )
}
