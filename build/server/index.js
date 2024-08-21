import { jsx, jsxs } from 'react/jsx-runtime';
import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable, redirect, json } from '@remix-run/node';
import { RemixServer, NavLink, Outlet, Links, Scripts, useSearchParams, useLoaderData, Await } from '@remix-run/react';
import * as isbotModule from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { CacheProvider, withEmotionCache } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import { Tooltip, Icon, Input, Skeleton, extendTheme, ChakraProvider, Card, CardHeader, CardBody, Flex, Avatar, Box, Heading, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { startCase, debounce } from 'lodash-es';
import { FaUserAlt } from 'react-icons/fa';
import { FaBoltLightning } from 'react-icons/fa6';
import { createContext, useContext, useEffect, useState, Suspense } from 'react';
import { relations, ilike, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { pgTable, serial, timestamp, text, index, uniqueIndex, pgEnum, integer } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

createEmotionCache();
function createEmotionCache() {
  return createCache({ key: "cha" });
}

const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const emotionCache = createEmotionCache();
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(CacheProvider, { value: emotionCache, children: /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ) }),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);
          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          body.pipe(bodyWithStyles);
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const emotionCache = createEmotionCache();
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(CacheProvider, { value: emotionCache, children: /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ) }),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const emotionServer = createEmotionServer(emotionCache);
          const bodyWithStyles = emotionServer.renderStylesToNodeStream();
          body.pipe(bodyWithStyles);
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

const entryServer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: 'Module' }));

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    overflow: hidden;
`;
const Page = styled.div`
    width: calc(100vw - 40px);
    padding: 20px;
`;
const Nav = styled.nav`
    width: 60px;
    height: 100%;
    box-shadow: rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 40px;
    padding-top: 25px;
`;
const Navigation = ({ items }) => {
  return /* @__PURE__ */ jsxs(Container, { children: [
    /* @__PURE__ */ jsx(Nav, { children: items.map((item) => /* @__PURE__ */ jsx(Tooltip, { hasArrow: true, placement: "right", label: startCase(item.name), children: /* @__PURE__ */ jsx(NavLink, { to: `/${item.route}`, children: /* @__PURE__ */ jsx(Icon, { height: 8, width: 8, as: item.icon }) }) }, item.name)) }),
    /* @__PURE__ */ jsx(Page, { children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
};

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
`;
const ListContainerWithSearch = ({ searchTerm, onChange, children }) => {
  return /* @__PURE__ */ jsxs(ListContainer, { children: [
    /* @__PURE__ */ jsx(Input, { style: { height: 40, minHeight: 40, borderRadius: 4 }, placeholder: "Type to search...", value: searchTerm || "", onChange: (e) => onChange(e.target.value) }),
    children
  ] });
};

const ErrorContainer = styled.div`
    width: 100%;
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: auto;
`;
const Description = styled.p`
    text-overflow: wrap;
`;
const ErrorComponent = ({ header, text }) => {
  return /* @__PURE__ */ jsxs(ErrorContainer, { children: [
    /* @__PURE__ */ jsx("h3", { children: header }),
    /* @__PURE__ */ jsx(Description, { children: text })
  ] });
};

const CardSkeletonList = ({ count }) => {
  return /* @__PURE__ */ jsx(ListContainer, { children: [...Array.from(Array(count).keys())].map((i) => /* @__PURE__ */ jsx(Skeleton, { borderRadius: 4, height: "100px", width: "100%" }, i)) });
};

const indexStyles = "/assets/index-BPvgi06w.css";

const ServerStyleContext = createContext(null);
const ClientStyleContext = createContext(null);

const favicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURQAAAKF4Kq2CLcGRM4ZkI7iKMGNKGM2aNhwWB3pbIDMmDHBUHZNuJtmjOZubmxIOBUk2EldBFkdHR+euPSEhITc3N2RkZHx8fEpdfBkAAADfSURBVDjL3ZLLbgUhCIZFuYi30bE9ff83Lc6ymrPqpkUDMfkC/KBzf8l6ijFeV0/XY2MDkHtPiS0YGIdsQFEeHX1mHSkN2QFA5UI+Z8UxyB8BECHOWoBOgAeqlbyqlhAC7IDIFJGiiD5QPWSoU2aQktEqBJG6AxKCh4JaJBg79xJUiQAXIHXWQw9gKUBNizUr4A+AiUPNTCYCywHwpHkBJmLN4iBTU8rK2UNf09oBXEtiRkypD8Z9m/GxzsvbWn/5N93X8h/rPif+BF7NtdZuI9vLwn3by321Nyk/3T+zb8OXCb1VgEUZAAAAAElFTkSuQmCC";

const logo = "/assets/logo-DcbGQaOU.png";

const links = () => {
  return [
    { rel: "icon", href: favicon },
    { rel: "apple-touch-icon", href: logo },
    // { rel: "manifest", href: "/manifest.json" },
    { rel: "stylesheet", href: indexStyles }
  ];
};
const colors = {
  brand: {
    900: "#1a365d",
    800: "#153e75",
    700: "#2a69ac"
  }
};
const theme = extendTheme({ colors });
const ROUTES = {
  users: "users/",
  events: "events/"
};
const navItems = [
  {
    route: ROUTES.users,
    icon: FaUserAlt,
    name: "Users"
  },
  {
    route: ROUTES.events,
    icon: FaBoltLightning,
    name: "Events"
  }
];
const Root = withEmotionCache((_, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);
  useEffect(() => {
    emotionCache.sheet.container = document.head;
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      emotionCache.sheet._insertTag(tag);
    });
    clientStyleData?.reset();
  }, []);
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        }
      ),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#000000" }),
      /* @__PURE__ */ jsx(
        "meta",
        {
          name: "description",
          content: "Funnel Intelligence"
        }
      ),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx("title", { children: "Funnel Intelligence" }),
      serverStyleData?.map(({ key, ids, css }) => /* @__PURE__ */ jsx(
        "style",
        {
          "data-emotion": `${key} ${ids.join(" ")}`,
          dangerouslySetInnerHTML: { __html: css }
        },
        key
      ))
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("div", { id: "root", children: /* @__PURE__ */ jsx(ChakraProvider, { theme, children: /* @__PURE__ */ jsx(Navigation, { items: navItems }) }) }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
});

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Root,
  links
}, Symbol.toStringTag, { value: 'Module' }));

const loader$2 = async () => {
  return redirect(`/users`);
};

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  loader: loader$2
}, Symbol.toStringTag, { value: 'Module' }));

const users = pgTable("users", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  email: text("email").notNull(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  phoneNumber: text("phoneNumber").notNull(),
  image: text("image")
}, (table) => {
  return {
    firstNameIdx: index("first_name_idx").on(table.firstName),
    lastNameIdx: index("last_name_idx").on(table.lastName),
    emailIdx: uniqueIndex("email_idx").on(table.email)
  };
});
const userSchema = createSelectSchema(users);
const usersRelations = relations(users, ({ many }) => ({
  events: many(events)
}));
const eventTypeEnumValues = ["page_view", "click", "bounce", "logged_in", "signed_up", "subscribed"];
const eventType = pgEnum("eventType", eventTypeEnumValues);
const eventTypeEnum = z.enum(eventType.enumValues);
const events = pgTable("events", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  content: text("content").notNull(),
  userId: integer("userId").notNull(),
  eventType: eventType("eventType"),
  url: text("url")
}, (table) => {
  return {
    userIdx: index("user_event_idx").on(table.userId)
  };
});
const eventsSchema = createSelectSchema(events);
const eventsRelation = relations(events, ({ one }) => ({
  user: one(users, { fields: [events.userId], references: [users.id] })
}));

const dbSchema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  eventType,
  eventTypeEnum,
  eventTypeEnumValues,
  events,
  eventsRelation,
  eventsSchema,
  userSchema,
  users,
  usersRelations
}, Symbol.toStringTag, { value: 'Module' }));

var define_process_env_default = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "9d84d81b-de88-4afe-8b66-9e2329f2076f", FIG_PID: "98045", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "9d84d81b-de88-4afe-8b66-9e2329f2076f", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p0:D9104C5E-BDDA-4C3F-837D-48C8DFC34477", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "98045", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys002", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "9d84d81b-de88-4afe-8b66-9e2329f2076f", ITERM_SESSION_ID: "w0t0p0:D9104C5E-BDDA-4C3F-837D-48C8DFC34477", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "9f468c3a41a2418988d401906ca48147", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "production", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql" };
const client = new Client({
  host: define_process_env_default.HOST,
  port: define_process_env_default.DB_PORT,
  user: define_process_env_default.DB_USER,
  password: define_process_env_default.PASSWORD,
  database: define_process_env_default.DB,
  ssl: false
});
await client.connect();
const db = drizzle(client, { schema: dbSchema });

const loader$1 = async ({
  request
}) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("query");
  const data = await db.query.events.findMany({
    where: ilike(events.content, `%${term}%`)
  });
  if (!data) {
    throw json(
      { events: [] },
      { status: 401 }
    );
  }
  return json(data);
};
const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query"));
  useEffect(() => {
    debounce(() => {
      setSearchParams((prev) => {
        prev.set("query", searchTerm || "");
        return prev;
      });
    }, 400);
  }, [searchTerm]);
  const events2 = useLoaderData();
  return /* @__PURE__ */ jsx(ListContainerWithSearch, { searchTerm, onChange: setSearchTerm, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(CardSkeletonList, { count: 10 }), children: /* @__PURE__ */ jsx(Await, { resolve: events2, children: (events3) => /* @__PURE__ */ jsx(ListContainer, { children: /* @__PURE__ */ jsxs(ListContainer, { style: { overflow: "scroll", height: "100%" }, children: [
    events3?.length === 0 && /* @__PURE__ */ jsx(ErrorComponent, { header: "No Events found...", text: "Try adjusting your query OR go get some events!" }),
    events3?.length > 0 && /* @__PURE__ */ jsx(ListContainer, { style: { overflow: "scroll", height: "100%" }, children: events3.map((event) => /* @__PURE__ */ jsxs(Card, { variant: "outline", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: `${startCase(event?.eventType)}` }),
      /* @__PURE__ */ jsx(CardBody, { children: `${event.url} | ${event.content}` })
    ] }, event.id)) })
  ] }) }) }) }) });
};

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Events,
  default: Events,
  loader: loader$1
}, Symbol.toStringTag, { value: 'Module' }));

const loader = async ({
  request
}) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("query");
  const data = await db.query.users.findMany({
    where: or(ilike(users.firstName, `%${term}%`), ilike(users.lastName, `%${term}%`), ilike(users.email, `%${term}%`))
  });
  if (!data) {
    throw json(
      { users: [] },
      { status: 401 }
    );
  }
  return json(data);
};
const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query"));
  useEffect(() => {
    debounce(() => {
      setSearchParams((prev) => {
        prev.set("query", searchTerm || "");
        return prev;
      });
    }, 400);
  }, [searchTerm]);
  const users2 = useLoaderData();
  return /* @__PURE__ */ jsx(ListContainerWithSearch, { searchTerm, onChange: setSearchTerm, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(CardSkeletonList, { count: 10 }), children: /* @__PURE__ */ jsx(Await, { resolve: users2, children: (users3) => /* @__PURE__ */ jsxs(ListContainer, { children: [
    users3 && users3?.length === 0 && /* @__PURE__ */ jsx(ErrorComponent, { header: "No Users found...", text: "Try adjusting your query OR go get some users!" }),
    users3 && users3?.length > 0 && /* @__PURE__ */ jsx(ListContainer, { style: { overflow: "scroll", height: "100%" }, children: users3.map((user) => /* @__PURE__ */ jsx(Card, { variant: "outline", children: /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(Flex, { gap: "4", children: /* @__PURE__ */ jsxs(Flex, { flex: "1", gap: "4", alignItems: "center", flexWrap: "wrap", children: [
      /* @__PURE__ */ jsx(Avatar, { name: `${user.firstName} ${user.lastName}`, src: user?.image || void 0 }),
      /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsx(Heading, { size: "sm", children: `${user.firstName} ${user.lastName}` }),
        /* @__PURE__ */ jsx(Text, { children: `${user.email} | ${user.phoneNumber}` })
      ] })
    ] }) }) }) }, user.id)) })
  ] }) }) }) });
};

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Users,
  default: Users,
  loader
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-DU6FvMMA.js','imports':['/assets/emotion-element-5486c51c.browser.esm-aXdZ-i2G.js','/assets/context-DCszVdUq.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/root-C81QIA9U.js','imports':['/assets/emotion-element-5486c51c.browser.esm-aXdZ-i2G.js','/assets/context-DCszVdUq.js','/assets/error-components-Cog0L8rg.js'],'css':[]},'routes/_index':{'id':'routes/_index','parentId':'root','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/route-l0sNRNKZ.js','imports':[],'css':[]},'routes/events':{'id':'routes/events','parentId':'root','path':'events','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/route-D3PE5biG.js','imports':['/assets/emotion-element-5486c51c.browser.esm-aXdZ-i2G.js','/assets/error-components-Cog0L8rg.js','/assets/card-skeletons-Xm5LnyUO.js'],'css':[]},'routes/users':{'id':'routes/users','parentId':'root','path':'users','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/route-Bd8WVu0K.js','imports':['/assets/emotion-element-5486c51c.browser.esm-aXdZ-i2G.js','/assets/error-components-Cog0L8rg.js','/assets/card-skeletons-Xm5LnyUO.js'],'css':[]}},'url':'/assets/manifest-bbaad2f3.js','version':'bbaad2f3'};

/**
       * `mode` is only relevant for the old Remix compiler but
       * is included here to satisfy the `ServerBuild` typings.
       */
      const mode = "production";
      const assetsBuildDirectory = "build/client";
      const basename = "/";
      const future = {"v3_fetcherPersist":false,"v3_relativeSplatPath":false,"v3_throwAbortReason":false,"unstable_singleFetch":false,"unstable_lazyRouteDiscovery":false};
      const isSpaMode = false;
      const publicPath = "/";
      const entry = { module: entryServer };
      const routes = {
        "root": {
          id: "root",
          parentId: undefined,
          path: "",
          index: undefined,
          caseSensitive: undefined,
          module: route0
        },
  "routes/_index": {
          id: "routes/_index",
          parentId: "root",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route1
        },
  "routes/events": {
          id: "routes/events",
          parentId: "root",
          path: "events",
          index: undefined,
          caseSensitive: undefined,
          module: route2
        },
  "routes/users": {
          id: "routes/users",
          parentId: "root",
          path: "users",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, mode, publicPath, routes };
