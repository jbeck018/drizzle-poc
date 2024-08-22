import { ChakraProvider } from "@chakra-ui/react";
import { withEmotionCache } from '@emotion/react';
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Outlet, Scripts, ScrollRestoration, json, useLoaderData } from "@remix-run/react";
import { useContext, useEffect } from "react";
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { HoneypotProvider } from 'remix-utils/honeypot/react';
import { honeypot } from '#app/utils/honeypot.server'
import { db } from "#db/db.server";
import favicon from './assets/favicon.png';
import logo from './assets/logo.png';
import { Toaster, useToast } from "./components";
import { GenericErrorBoundary } from "./components/misc/error-boundary";
import { ClientStyleContext, ServerStyleContext } from './context';
import indexStyles from './index.css?url';
import { authenticator } from "./modules/auth/auth.server";
import theme from "./theme/theme";
import { csrf } from "./utils/csrf.server";
import { useNonce } from "./utils/hooks/use-nonce";
import { combineHeaders, getDomainUrl } from "./utils/misc.server";
import { getToastSession } from "./utils/toast.server";

export const links: LinksFunction = () => {
  // `links` returns an array of objects whose
  // properties map to the `<link />` component props
  return [
      { rel: "icon", href: favicon },
      { rel: "apple-touch-icon", href: logo },
      // { rel: "manifest", href: "/manifest.json" },
    { rel: "stylesheet", href: indexStyles },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request)
  const user = sessionUser?.id
    ? await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id,sessionUser?.id),
        with: {
          roles: {
            with: {
              role: true,
            }
          },
        }
      })
    : null

  const { toast, headers: toastHeaders } = await getToastSession(request)
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken()

  return json(
    {
      user,
      toast,
      csrfToken,
      honeypotProps: honeypot.getInputProps(),
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname,
      },
    } as const,
    {
      headers: combineHeaders(
        toastHeaders,
        csrfCookieHeader ? { 'Set-Cookie': csrfCookieHeader } : null,
      ),
    },
  )
}

const Root = withEmotionCache((_, emotionCache) => {
  const { toast, csrfToken, honeypotProps } = useLoaderData<typeof loader>()
  const nonce = useNonce()
  useToast(toast)
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData?.reset();
  }, []);
  
  return (
    <html lang="en">
      <head style={{ height: '100vh', width: '100vw' }}>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Funnel Intelligence"
        />
        <Links />
        <title>Funnel Intelligence</title>
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body style={{ height: '100vh', width: '100vw' }}> 
        <div id="root" style={{ height: '100vh', width: '100vw' }}>
            <ChakraProvider theme={theme}>
              <HoneypotProvider {...honeypotProps}>
                <AuthenticityTokenProvider token={csrfToken}>
                  <Outlet />
                </AuthenticityTokenProvider>
              </HoneypotProvider>
            </ChakraProvider>
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Toaster closeButton position="bottom-center" theme={'system'} />
      </body>
    </html>
  );
});

export const ErrorBoundary = withEmotionCache((_, emotionCache) => {
  const nonce = useNonce()
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData?.reset();
  }, []);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Funnel Intelligence"
        />
        <Links />
        <title>Funnel Intelligence</title>
        {serverStyleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
        <div id="root">
          <ChakraProvider theme={theme}>
            <GenericErrorBoundary
              statusHandlers={{
                403: ({ error }: { error: any }) => (
                  <p>You are not allowed to do that: {error?.data.message}</p>
                ),
              }}
            />
          </ChakraProvider>
        </div>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Toaster closeButton position="bottom-center" theme={'system'} />
      </body>
    </html>
  );
});

export default Root;