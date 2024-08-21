import { Navigation } from "./components";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from '@chakra-ui/react'
import { FaUserAlt } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import { Links, Scripts } from "@remix-run/react";
import indexStyles from './index.css?url';
import { LinksFunction } from "@remix-run/node";
import { withEmotionCache } from '@emotion/react';
import { ServerStyleContext, ClientStyleContext } from './context';
import { useContext, useEffect } from "react";
import favicon from './assets/favicon.png';
import logo from './assets/logo.png';

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

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

const ROUTES = {
  users: "users/",
  events: "events/",
}

const navItems = [
  {
    route: ROUTES.users,
    icon: FaUserAlt,
    name: 'Users',
  },
  {
    route: ROUTES.events,
    icon: FaBoltLightning,
    name: 'Events',
  },
];



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
                <Navigation items={navItems} />
            </ChakraProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
});

export default Root;