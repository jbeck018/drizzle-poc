import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from '@chakra-ui/react'
import { withEmotionCache } from '@emotion/react';
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Outlet, Scripts, json } from "@remix-run/react";
import { useContext, useEffect } from "react";
import { db } from "#db/db.server";
import favicon from './assets/favicon.png';
import logo from './assets/logo.png';
import { ClientStyleContext, ServerStyleContext } from './context';
import indexStyles from './index.css?url';
import { authenticator } from "./modules/auth/auth.server";
import { csrf } from "./utils/csrf.server";
import { getHints } from "./utils/hooks/use-hints";
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
      })
    : null

  const { toast, headers: toastHeaders } = await getToastSession(request)
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken()

  return json(
    {
      user,
      toast,
      csrfToken,
      requestInfo: {
        hints: getHints(request),
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

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })



const Root = withEmotionCache((_, emotionCache) => {
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
                <Outlet />
            </ChakraProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
});

export default Root;