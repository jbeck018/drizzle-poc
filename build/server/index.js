import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { PassThrough } from 'node:stream';
import { createReadableStreamFromReadable, createCookieSessionStorage, createCookie, redirect, json, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler, MaxPartSizeExceededError } from '@remix-run/node';
import { RemixServer, NavLink, Outlet, useFormAction, useNavigation, useNavigate, useLoaderData, Form, useLocation, Link, useSubmit, useParams, useRouteError, isRouteErrorResponse, Links, ScrollRestoration, Scripts, json as json$1, useRevalidator, useActionData, useFetcher, useSearchParams, Await } from '@remix-run/react';
import * as isbotModule from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { CacheProvider, withEmotionCache } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createCache from '@emotion/cache';
import { Tooltip, Icon, Image, Input as Input$1, Skeleton, extendTheme, ChakraProvider, Img as Img$1, Card, CardHeader, Flex, Avatar, Box, Heading as Heading$1, Text as Text$1 } from '@chakra-ui/react';
import * as React from 'react';
import { useRef, useEffect, useState, createContext, useContext, Suspense } from 'react';
import { AuthenticityTokenInput, AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { HoneypotInputs, HoneypotProvider } from 'remix-utils/honeypot/react';
import { Honeypot, SpamError } from 'remix-utils/honeypot/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { relations, eq, or, ilike } from 'drizzle-orm';
import { customType, pgTable, uuid, varchar, text, timestamp, uniqueIndex, index, primaryKey, integer, boolean, pgEnum, serial, numeric } from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import styled from '@emotion/styled';
import { startCase } from 'lodash-es';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, ChevronUp, Check, Languages, ChevronRight, Circle, Loader2, ShoppingBasket, ExternalLink, Slash, Settings, LogOut, HelpCircle, BadgeCheck, AlertTriangle, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { Authenticator } from 'remix-auth';
import { GitHubStrategy } from 'remix-auth-github';
import { TOTPStrategy } from 'remix-auth-totp';
import { FaUserAlt } from 'react-icons/fa';
import { toast, Toaster as Toaster$1 } from 'sonner';
import Stripe from 'stripe';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useHydrated } from 'remix-utils/use-hydrated';
import { CSRF, CSRFError } from 'remix-utils/csrf/server';
import { getClientLocales } from 'remix-utils/locales/server';
import { render } from '@react-email/render';
import { Html, Head, Preview, Body, Container as Container$1, Img, Heading, Section, Button as Button$1, Text, Hr, Link as Link$1 } from '@react-email/components';
import { useTranslation } from 'react-i18next';

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

var define_process_env_default$9 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const honeypot = new Honeypot({
  encryptionSeed: define_process_env_default$9.HONEYPOT_ENCRYPTION_SEED
});
function checkHoneypot(formData) {
  try {
    honeypot.check(formData);
  } catch (err) {
    if (err instanceof SpamError) {
      throw new Response("Form not submitted properly", { status: 400 });
    }
    throw err;
  }
}

const bytea = customType({
  dataType() {
    return "bytea";
  }
});
const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    username: varchar("username", { length: 255 }),
    customer_id: varchar("customer_id", { length: 255 }),
    first_name: text("first_name"),
    last_name: text("last_name"),
    phone_number: text("phone_number"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    email_idx: uniqueIndex("email_idx").on(table.email),
    username_idx: uniqueIndex("username_idx").on(table.username),
    customer_id_idx: uniqueIndex("customer_id_idx").on(table.customer_id),
    first_name_idx: index("first_name_idx").on(table.first_name),
    last_name_idx: index("last_name_idx").on(table.last_name)
  })
);
const usersRelations = relations(users, ({ one, many }) => ({
  image: one(user_images),
  subscription: one(subscriptions),
  usersToRoles: many(usersToRoles),
  roles: many(usersToRoles)
}));
const userSchema = createSelectSchema(users);
const user_images = pgTable(
  "user_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    alt_text: text("alt_text"),
    content_type: varchar("content_type", { length: 255 }).notNull(),
    blob: bytea("blob").notNull(),
    user_id: uuid("user_id").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    user_id_idx: uniqueIndex("user_id_idx").on(table.user_id)
  })
);
const userImageSchema = createSelectSchema(user_images);
const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").default(""),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    name_idx: uniqueIndex("name_idx").on(table.name)
  })
);
const rolesRelations = relations(roles, ({ many }) => ({
  users: many(usersToRoles),
  usersToRoles: many(usersToRoles),
  rolesToPermissions: many(rolesToPermissions),
  permissions: many(rolesToPermissions)
}));
const roleSchema = createSelectSchema(roles);
const usersToRoles = pgTable(
  "users_to_roles",
  {
    role_id: uuid("role_id").notNull().references(() => roles.id),
    user_id: uuid("user_id").notNull().references(() => users.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.role_id, t.user_id] })
  })
);
const usersToRolesRelations = relations(usersToRoles, ({ one }) => ({
  permission: one(users, {
    fields: [usersToRoles.user_id],
    references: [users.id]
  }),
  role: one(roles, {
    fields: [usersToRoles.role_id],
    references: [roles.id]
  })
}));
const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entity: varchar("entity", { length: 255 }).notNull(),
    action: varchar("action", { length: 255 }).notNull(),
    access: varchar("access", { length: 255 }).notNull(),
    description: text("description").default(""),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    action_entity_access_idx: uniqueIndex("action_entity_access_idx").on(
      table.action,
      table.entity,
      table.access
    )
  })
);
const permissionsRelations = relations(permissions, ({ many }) => ({
  rolesToPermissions: many(rolesToPermissions),
  roles: many(rolesToPermissions)
}));
const permissionSchema = createSelectSchema(permissions);
const rolesToPermissions = pgTable(
  "roles_to_permissions",
  {
    role_id: uuid("role_id").notNull().references(() => roles.id),
    permission_id: uuid("permission_id").notNull().references(() => permissions.id)
  },
  (t) => ({
    pk: primaryKey({ columns: [t.role_id, t.permission_id] })
  })
);
const rolesToPermissionsRelations = relations(
  rolesToPermissions,
  ({ one }) => ({
    permission: one(permissions, {
      fields: [rolesToPermissions.permission_id],
      references: [permissions.id]
    }),
    role: one(roles, {
      fields: [rolesToPermissions.role_id],
      references: [roles.id]
    })
  })
);
const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow()
});
const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
  prices: many(prices)
}));
const planSchema = createSelectSchema(plans);
const prices = pgTable(
  "prices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    plan_id: uuid("plan_id").notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 255 }).notNull(),
    interval: varchar("interval", { length: 255 }).notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    plan_id_idx: index("plan_id_idx").on(table.plan_id)
  })
);
const pricesRelations = relations(prices, ({ one, many }) => ({
  plan: one(plans, {
    fields: [prices.plan_id],
    references: [plans.id]
  }),
  subscriptions: many(subscriptions)
}));
const priceSchema = createSelectSchema(prices);
const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").notNull(),
    plan_id: uuid("plan_id").notNull(),
    price_id: uuid("price_id").notNull(),
    interval: varchar("interval", { length: 255 }).notNull(),
    status: varchar("status", { length: 255 }).notNull(),
    current_period_start: integer("current_period_start").notNull(),
    current_period_end: integer("current_period_end").notNull(),
    cancel_at_period_end: boolean("cancel_at_period_end").default(false),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow()
  },
  (table) => ({
    user_id__subscription_idx: uniqueIndex("user_id__subscription_idx").on(
      table.user_id
    ),
    subscription_plan_id_idx: index("subscription_plan_id_idx").on(
      table.plan_id
    ),
    price_id_idx: index("price_id_idx").on(table.price_id)
  })
);
const subscriptionRelations = relations(subscriptions, ({ one }) => ({
  plan: one(plans, {
    fields: [subscriptions.plan_id],
    references: [plans.id]
  }),
  price: one(prices, {
    fields: [subscriptions.price_id],
    references: [prices.id]
  })
}));
const subscriptionSchema = createSelectSchema(subscriptions);
const record_type_enum_values = [
  "account",
  "user",
  "contact",
  "opportunity",
  "task",
  "ticket"
];
const record_type_enum = pgEnum("record_type", record_type_enum_values);
const record_type_zod_enum = z.enum(record_type_enum.enumValues);
const records = pgTable(
  "records",
  {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    record_type: record_type_enum("record_type").notNull()
  },
  (table) => ({
    record_type_idx: index("record_type_idx").on(table.record_type)
  })
);
const recordsRelations = relations(records, ({ many }) => ({
  properties: many(properties)
}));
const recordsSchema = createSelectSchema(records);
const property_type_enum_values = [
  "text",
  "date",
  "boolean",
  "number"
];
const property_type_enum = pgEnum(
  "property_type",
  property_type_enum_values
);
const property_type_zod_enum = z.enum(property_type_enum.enumValues);
const properties = pgTable(
  "properties",
  {
    id: serial("id").primaryKey(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
    property_type: property_type_enum("property_type").notNull(),
    text_value: varchar("text_value", { length: 65535 }),
    date_value: timestamp("date_value", { withTimezone: false }),
    boolean_value: boolean("boolean_value"),
    number_value: numeric("number_value", { precision: 30, scale: 2 }),
    record_id: integer("record_id").notNull(),
    source: varchar("source", { length: 255 }),
    key: varchar("key", { length: 255 })
  },
  (table) => ({
    property_type_idx: index("property_type_idx").on(table.property_type),
    record_id_idx: index("record_id_idx").on(table.record_id),
    key_idx: index("key_idx").on(table.key)
  })
);
const propertiesRelations = relations(properties, ({ one }) => ({
  record: one(records, {
    fields: [properties.record_id],
    references: [records.id]
  })
}));
const propertiesSchema = createSelectSchema(properties);

const dbSchema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  permissionSchema,
  permissions,
  permissionsRelations,
  planSchema,
  plans,
  plansRelations,
  priceSchema,
  prices,
  pricesRelations,
  properties,
  propertiesRelations,
  propertiesSchema,
  property_type_enum,
  property_type_enum_values,
  property_type_zod_enum,
  record_type_enum,
  record_type_enum_values,
  record_type_zod_enum,
  records,
  recordsRelations,
  recordsSchema,
  roleSchema,
  roles,
  rolesRelations,
  rolesToPermissions,
  rolesToPermissionsRelations,
  subscriptionRelations,
  subscriptionSchema,
  subscriptions,
  userImageSchema,
  userSchema,
  user_images,
  users,
  usersRelations,
  usersToRoles,
  usersToRolesRelations
}, Symbol.toStringTag, { value: 'Module' }));

var define_process_env_default$8 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const client = new Client({
  host: define_process_env_default$8.HOST,
  port: define_process_env_default$8.DB_PORT,
  user: define_process_env_default$8.DB_USER,
  password: define_process_env_default$8.PASSWORD,
  database: define_process_env_default$8.DB,
  ssl: false
});
await client.connect();
const db = drizzle(client, { schema: dbSchema });

const favicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABIUExURQAAAKF4Kq2CLcGRM4ZkI7iKMGNKGM2aNhwWB3pbIDMmDHBUHZNuJtmjOZubmxIOBUk2EldBFkdHR+euPSEhITc3N2RkZHx8fEpdfBkAAADfSURBVDjL3ZLLbgUhCIZFuYi30bE9ff83Lc6ymrPqpkUDMfkC/KBzf8l6ijFeV0/XY2MDkHtPiS0YGIdsQFEeHX1mHSkN2QFA5UI+Z8UxyB8BECHOWoBOgAeqlbyqlhAC7IDIFJGiiD5QPWSoU2aQktEqBJG6AxKCh4JaJBg79xJUiQAXIHXWQw9gKUBNizUr4A+AiUPNTCYCywHwpHkBJmLN4iBTU8rK2UNf09oBXEtiRkypD8Z9m/GxzsvbWn/5N93X8h/rPif+BF7NtdZuI9vLwn3by321Nyk/3T+zb8OXCb1VgEUZAAAAAElFTkSuQmCC";

const Logo$1 = "/assets/logo-DcbGQaOU.png";

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

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function userHasRole(user, role) {
  if (!user) return false;
  return user.roles.some((r) => r.name === role);
}
function getUserImgSrc(imageId) {
  return imageId ? `/resources/user-images/${imageId}` : "";
}
function useIsPending({
  formAction,
  formMethod = "POST",
  state = "non-idle"
} = {}) {
  const contextualFormAction = useFormAction();
  const navigation = useNavigation();
  const isPendingState = state === "non-idle" ? navigation.state !== "idle" : navigation.state === state;
  return isPendingState && navigation.formAction === (formAction ?? contextualFormAction) && navigation.formMethod === formMethod;
}
function callAll(...fns) {
  return (...args) => fns.forEach((fn) => fn?.(...args));
}

const Select = SelectPrimitive.Root;
const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
  SelectPrimitive.Content,
  {
    ref,
    className: cn(
      "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsx(
        SelectPrimitive.Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Label,
  {
    ref,
    className: cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  SelectPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SelectPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

function LanguageSwitcher() {
  const navigate = useNavigate();
  const pathname = location.pathname.replace(/\/$/, "");
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;
  const langs = [
    { text: "English", value: "en" },
    { text: "Spanish", value: "es" }
  ];
  const formatLanguage = (lng) => {
    return langs.find((lang) => lang.value === lng)?.text;
  };
  return /* @__PURE__ */ jsxs(Select, { onValueChange: (value) => navigate(`${pathname}?lng=${value}`), children: [
    /* @__PURE__ */ jsx(SelectTrigger, { className: "h-6 rounded border-primary/20 bg-secondary !px-2 hover:border-primary/40", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsx(Languages, { className: "h-[14px] w-[14px]" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", children: formatLanguage(language || "en") })
    ] }) }),
    /* @__PURE__ */ jsx(SelectContent, { children: langs.map(({ text, value }) => /* @__PURE__ */ jsx(
      SelectItem,
      {
        value,
        className: `text-sm font-medium text-primary/60`,
        children: text
      },
      value
    )) })
  ] });
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuSubTrigger = React.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.SubTrigger,
  {
    ref,
    className: cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
const DropdownMenuSubContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.SubContent,
  {
    ref,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Content,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    ),
    ...props
  }
) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
const DropdownMenuItem = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
const DropdownMenuCheckboxItem = React.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
const DropdownMenuRadioItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    className: cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx("span", { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) }) }),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
const DropdownMenuLabel = React.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
const DropdownMenuSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const PLANS = {
  FREE: "free",
  PRO: "pro"
};
const INTERVALS = {
  MONTH: "month",
  YEAR: "year"
};
const CURRENCIES = {
  DEFAULT: "usd",
  USD: "usd",
  EUR: "eur"
};
const PRICING_PLANS = {
  [PLANS.FREE]: {
    id: PLANS.FREE,
    name: "Free",
    description: "Start with the basics, upgrade anytime.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 0,
        [CURRENCIES.EUR]: 0
      }
    }
  },
  [PLANS.PRO]: {
    id: PLANS.PRO,
    name: "Pro",
    description: "Access to all features and unlimited projects.",
    prices: {
      [INTERVALS.MONTH]: {
        [CURRENCIES.USD]: 1990,
        [CURRENCIES.EUR]: 1990
      },
      [INTERVALS.YEAR]: {
        [CURRENCIES.USD]: 19990,
        [CURRENCIES.EUR]: 19990
      }
    }
  }
};

const ROUTE_PATH$i = "/dashboard";
const ROUTES = {
  users: "users"
};
const navItems = [
  {
    route: ROUTE_PATH$i + ROUTES.users,
    icon: FaUserAlt,
    name: "Users"
  }
];
function Dashboard() {
  return /* @__PURE__ */ jsx(Navigation, { items: navItems });
}

const route13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$i,
  default: Dashboard
}, Symbol.toStringTag, { value: 'Module' }));

const Switch = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  SwitchPrimitives.Root,
  {
    className: cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsx(
      SwitchPrimitives.Thumb,
      {
        className: cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = SwitchPrimitives.Root.displayName;

const ROUTE_PATH$h = "/auth/logout";
async function loader$k({ request }) {
  return authenticator.logout(request, { redirectTo: "/" });
}
async function action$9({ request }) {
  return authenticator.logout(request, { redirectTo: "/" });
}

const route10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$h,
  action: action$9,
  loader: loader$k
}, Symbol.toStringTag, { value: 'Module' }));

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return /* @__PURE__ */ jsx(
      "input",
      {
        type,
        className: cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Input.displayName = "Input";

var define_process_env_default$7 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const AUTH_SESSION_KEY = "_auth";
const authSessionStorage = createCookieSessionStorage({
  cookie: {
    name: AUTH_SESSION_KEY,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: [define_process_env_default$7.SESSION_SECRET],
    secure: define_process_env_default$7.NODE_ENV === "production"
  }
});
const { getSession, commitSession, destroySession } = authSessionStorage;

var define_process_env_default$6 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const CSRF_COOKIE_KEY = "_csrf";
const cookie = createCookie(CSRF_COOKIE_KEY, {
  path: "/",
  sameSite: "lax",
  httpOnly: true,
  secrets: [define_process_env_default$6.SESSION_SECRET],
  secure: define_process_env_default$6.NODE_ENV === "production"
});
const csrf = new CSRF({ cookie });
async function validateCSRF(formData, headers) {
  try {
    await csrf.validate(formData, headers);
  } catch (err) {
    if (err instanceof CSRFError) {
      throw new Response("Invalid CSRF token", { status: 403 });
    }
    throw err;
  }
}

const siteConfig = {
  siteTitle: "Funnel Intelligence",
  siteDescription: "Understand your Funnels.",
  siteUrl: "https://remix-saas.fly.dev",
  siteImage: "../../assets/logo.png",
  favicon: "../../assets/favicon.png",
  email: "jacobbeck.dev@gmail.com",
  address: ""
};

const ROUTE_PATH$g = "/auth/verify";
const VerifyLoginSchema = z.object({
  code: z.string().min(6, "Code must be at least 6 characters.")
});
const meta$7 = () => {
  return [{ title: `${siteConfig.siteTitle} - Verify` }];
};
async function loader$j({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: ROUTE_PATH$i
  });
  const cookie = await getSession(request.headers.get("Cookie"));
  const authEmail = cookie.get("auth:email");
  const authError = cookie.get(authenticator.sessionErrorKey);
  if (!authEmail) return redirect("/auth/login");
  return json({ authEmail, authError }, {
    headers: {
      "Set-Cookie": await commitSession(cookie)
    }
  });
}
async function action$8({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  await validateCSRF(formData, clonedRequest.headers);
  checkHoneypot(formData);
  await authenticator.authenticate("TOTP", request, {
    successRedirect: pathname,
    failureRedirect: pathname
  });
}
function Verify() {
  const { authEmail, authError } = useLoaderData();
  const inputRef = useRef(null);
  const isHydrated = useHydrated();
  const [codeForm, { code }] = useForm({
    constraint: getZodConstraint(VerifyLoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyLoginSchema });
    }
  });
  useEffect(() => {
    isHydrated && inputRef.current?.focus();
  }, [isHydrated]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-center text-2xl text-primary", children: "Check your inbox!" }),
      /* @__PURE__ */ jsxs("p", { className: "text-center text-base font-normal text-primary/60", children: [
        "We've just emailed you a temporary password.",
        /* @__PURE__ */ jsx("br", {}),
        "Please enter it below."
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        autoComplete: "off",
        className: "flex w-full flex-col items-start gap-1",
        ...getFormProps(codeForm),
        children: [
          /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "code", className: "sr-only", children: "Code" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Code",
                ref: inputRef,
                required: true,
                className: `bg-transparent ${code.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(code, { type: "text" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            !authError && code.errors && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: code.errors.join(" ") }),
            authEmail && authError && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: authError.message })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: "Continue" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Form, { method: "POST", className: "flex w-full flex-col", children: [
      /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
      /* @__PURE__ */ jsx(HoneypotInputs, {}),
      /* @__PURE__ */ jsx("p", { className: "text-center text-sm font-normal text-primary/60", children: "Did not receive the code?" }),
      /* @__PURE__ */ jsx(Button, { type: "submit", variant: "ghost", className: "w-full hover:bg-transparent", children: "Request New Code" })
    ] })
  ] });
}

const route12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$g,
  VerifyLoginSchema,
  action: action$8,
  default: Verify,
  loader: loader$j,
  meta: meta$7
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$f = "/auth/login";
const LoginSchema = z.object({
  email: z.string().max(256).email("Email address is not valid.")
});
const meta$6 = () => {
  return [{ title: `${siteConfig.siteTitle} - Login` }];
};
async function loader$i({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: ROUTE_PATH$i
  });
  const cookie = await getSession(request.headers.get("Cookie"));
  const authEmail = cookie.get("auth:email");
  const authError = cookie.get(authenticator.sessionErrorKey);
  return json({ authEmail, authError }, {
    headers: {
      "Set-Cookie": await commitSession(cookie)
    }
  });
}
async function action$7({ request }) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  await validateCSRF(formData, clonedRequest.headers);
  checkHoneypot(formData);
  await authenticator.authenticate("TOTP", request, {
    successRedirect: ROUTE_PATH$g,
    failureRedirect: pathname
  });
}
function Login() {
  const { authEmail, authError } = useLoaderData();
  const inputRef = useRef(null);
  const isHydrated = useHydrated();
  const isPending = useIsPending();
  const [emailForm, { email }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema });
    }
  });
  useEffect(() => {
    isHydrated && inputRef.current?.focus();
  }, [isHydrated]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-2 flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-center text-2xl font-medium text-primary", children: "Login to Funnel Intelligence" }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: "Welcome back! Please log in to continue." })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        autoComplete: "off",
        className: "flex w-full flex-col items-start gap-1",
        ...getFormProps(emailForm),
        children: [
          /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "sr-only", children: "Email" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Email",
                ref: inputRef,
                defaultValue: authEmail ? authEmail : "",
                className: `bg-transparent ${email.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(email, { type: "email" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            !authError && email.errors && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: email.errors.join(" ") }),
            !authEmail && authError && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: authError.message })
          ] }),
          /* @__PURE__ */ jsx(Button, { type: "submit", className: "w-full", children: isPending ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Continue with Email" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex w-full items-center justify-center", children: [
      /* @__PURE__ */ jsx("span", { className: "absolute w-full border-b border-border" }),
      /* @__PURE__ */ jsx("span", { className: "z-10 bg-card px-2 text-xs font-medium uppercase text-primary/60", children: "Or continue with" })
    ] }),
    /* @__PURE__ */ jsx(Form, { action: `/auth/github`, method: "POST", className: "w-full", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full gap-2 bg-transparent", children: [
      /* @__PURE__ */ jsx(
        "svg",
        {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-4 w-4 text-primary/80 group-hover:text-primary",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx(
            "path",
            {
              fill: "currentColor",
              fillRule: "nonzero",
              d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            }
          )
        }
      ),
      "Github"
    ] }) }),
    /* @__PURE__ */ jsxs("p", { className: "px-12 text-center text-sm font-normal leading-normal text-primary/60", children: [
      "By clicking continue, you agree to our",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/", className: "underline hover:text-primary", children: "Terms of Service" }),
      " ",
      "and",
      " ",
      /* @__PURE__ */ jsx("a", { href: "/", className: "underline hover:text-primary", children: "Privacy Policy." })
    ] })
  ] });
}

const route9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  LoginSchema,
  ROUTE_PATH: ROUTE_PATH$f,
  action: action$7,
  default: Login,
  loader: loader$i,
  meta: meta$6
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$e = "/auth/magic-link";
async function loader$h({ request }) {
  return authenticator.authenticate("TOTP", request, {
    successRedirect: ROUTE_PATH$i,
    failureRedirect: ROUTE_PATH$f
  });
}

const route11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$e,
  loader: loader$h
}, Symbol.toStringTag, { value: 'Module' }));

const ERRORS = {
  // Authentication.
  AUTH_EMAIL_NOT_SENT: "Unable to send email.",
  AUTH_USER_NOT_CREATED: "Unable to create user.",
  AUTH_SOMETHING_WENT_WRONG: "Something went wrong while trying to authenticate.",
  // Onboarding.
  ONBOARDING_USERNAME_ALREADY_EXISTS: "Username already exists.",
  ONBOARDING_SOMETHING_WENT_WRONG: "Something went wrong while trying to onboard.",
  // Stripe.
  STRIPE_MISSING_SIGNATURE: "Unable to verify webhook signature.",
  STRIPE_MISSING_ENDPOINT_SECRET: "Unable to verify webhook endpoint.",
  STRIPE_CUSTOMER_NOT_CREATED: "Unable to create customer.",
  STRIPE_SOMETHING_WENT_WRONG: "Something went wrong while trying to handle Stripe API.",
  // Misc.
  UNKNOWN: "Unknown error.",
  ENVS_NOT_INITIALIZED: "Environment variables not initialized.",
  SOMETHING_WENT_WRONG: "Something went wrong."
};

var define_process_env_default$5 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const HOST_URL = define_process_env_default$5.DEV_HOST_URL ;
function getDomainUrl(request) {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("Host");
  if (!host) return null;
  const protocol = host.includes("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
function getDomainPathname(request) {
  const pathname = new URL(request.url).pathname;
  if (!pathname) return null;
  return pathname;
}
function getLocaleCurrency(request) {
  const locales = getClientLocales(request);
  if (!locales) return CURRENCIES.DEFAULT;
  return locales.find((locale) => locale === "en-US") ? CURRENCIES.USD : CURRENCIES.EUR;
}
function combineHeaders(...headers) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

var define_process_env_default$4 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const ResendSuccessSchema = z.object({
  id: z.string()
});
const ResendErrorSchema = z.union([
  z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number()
  }),
  z.object({
    name: z.literal("UnknownError"),
    message: z.literal("Unknown Error"),
    statusCode: z.literal(500),
    cause: z.any()
  })
]);
async function sendEmail(options) {
  const from = "onboarding@resend.dev";
  const email = { from, ...options };
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${define_process_env_default$4.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(email)
  });
  const data = await response.json();
  const parsedData = ResendSuccessSchema.safeParse(data);
  if (response.ok && parsedData.success) {
    return { status: "success", data: parsedData };
  } else {
    const parsedErrorResult = ResendErrorSchema.safeParse(data);
    if (parsedErrorResult.success) {
      console.error(parsedErrorResult.data);
      throw new Error(ERRORS.AUTH_EMAIL_NOT_SENT);
    } else {
      console.error(data);
      throw new Error(ERRORS.AUTH_EMAIL_NOT_SENT);
    }
  }
}

function AuthEmail({ code, magicLink }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: "Your login code for Remix Auth TOTP" }),
    /* @__PURE__ */ jsx(
      Body,
      {
        style: {
          backgroundColor: "#ffffff",
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
        },
        children: /* @__PURE__ */ jsxs(Container$1, { style: { margin: "0 auto", padding: "20px 0 48px" }, children: [
          /* @__PURE__ */ jsx(
            Img,
            {
              src: "https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png",
              width: "40",
              height: "37",
              alt: ""
            }
          ),
          /* @__PURE__ */ jsx(
            Heading,
            {
              style: {
                fontSize: "24px",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
                fontWeight: "400",
                color: "#484848",
                padding: "12px 0 0"
              },
              children: "Your login code for Remix Auth TOTP"
            }
          ),
          magicLink && /* @__PURE__ */ jsx(Section, { style: { padding: "8px 0px" }, children: /* @__PURE__ */ jsx(
            Button$1,
            {
              style: {
                display: "block",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
                textAlign: "center",
                borderRadius: "3px",
                backgroundColor: "#5e6ad2"
              },
              href: magicLink,
              children: "Login to totp.fly"
            }
          ) }),
          /* @__PURE__ */ jsx(Text, { style: { fontSize: "14px", lineHeight: "20px" }, children: "This link and code will only be valid for the next 60 seconds. If the link does not work, you can use the login verification code directly:" }),
          /* @__PURE__ */ jsx(
            "code",
            {
              style: {
                padding: "1px 4px",
                color: "#3c4149",
                fontFamily: "sans-serif",
                fontSize: "24px",
                fontWeight: "700",
                letterSpacing: "2px"
              },
              children: code
            }
          ),
          /* @__PURE__ */ jsx(Hr, { style: { margin: "20px 0", borderColor: "#cccccc" } }),
          /* @__PURE__ */ jsx(Text, { style: { color: "#8898aa", fontSize: "12px" }, children: "200 totp.fly.dev - Los Angeles, CA" })
        ] })
      }
    )
  ] });
}
function renderAuthEmailEmail(args) {
  return render(/* @__PURE__ */ jsx(AuthEmail, { ...args }));
}
async function sendAuthEmail({ email, code, magicLink }) {
  const html = renderAuthEmailEmail({ email, code, magicLink });
  await sendEmail({
    to: email,
    subject: "Your login code for Remix Auth TOTP",
    html
  });
}

var define_process_env_default$3 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const authenticator = new Authenticator(authSessionStorage);
authenticator.use(
  new TOTPStrategy(
    {
      secret: define_process_env_default$3.ENCRYPTION_SECRET,
      magicLinkPath: ROUTE_PATH$e,
      sendTOTP: async ({ email, code, magicLink }) => {
        {
          console.log("[ Dev-Only ] TOTP Code:", code);
          if (email.startsWith("admin")) {
            console.log("Not sending email for admin user.");
            return;
          }
        }
        await sendAuthEmail({ email, code, magicLink });
      }
    },
    async ({ email }) => {
      let user = await db.query.users.findFirst({
        where: (users2, { eq }) => eq(users2.email, email)
      });
      if (!user) {
        user = await db.insert(users).values({
          email
        }).returning();
        if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
      }
      return user;
    }
  )
);
authenticator.use(
  new GitHubStrategy(
    {
      clientId: "",
      clientSecret: "",
      redirectURI: `${HOST_URL}/auth/github/callback`
    },
    async ({ profile }) => {
      const email = profile._json.email || profile.emails[0].value;
      let user = await db.query.users.findFirst({
        where: (users2, { eq }) => eq(users2.email, email)
      });
      if (!user) {
        user = await db.insert(users).values({
          roles: { connect: [{ name: "user" }] },
          email
        }).returning();
        if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED);
      }
      return user;
    }
  )
);
async function requireSessionUser(request, { redirectTo } = {}) {
  const sessionUser = await authenticator.isAuthenticated(request);
  if (!sessionUser) {
    if (!redirectTo) throw redirect(ROUTE_PATH$h);
    else throw redirect(redirectTo);
  }
  return sessionUser;
}
async function requireUser(request, { redirectTo } = {}) {
  const sessionUser = await authenticator.isAuthenticated(request);
  const user = sessionUser?.id ? await db.query.users.findFirst({
    where: (users2, { eq }) => eq(users2.id, sessionUser?.id)
  }) : null;
  if (!user) {
    if (!redirectTo) throw redirect(ROUTE_PATH$h);
    else throw redirect(redirectTo);
  }
  return user;
}

var define_process_env_default$2 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const stripe = new Stripe(define_process_env_default$2.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
  typescript: true
});

async function createCustomer({ userId }) {
  const user = await db.query.users.findFirst({
    where: (users2, { eq: eq2 }) => eq2(users2.id, userId)
  });
  if (!user || user.customer_id)
    throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);
  const email = user.email ?? void 0;
  const name = user.username ?? void 0;
  const customer = await stripe.customers.create({ email, name }).catch((err) => console.error(err));
  if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED);
  await db.update(users).set({ customer_id: customer.id }).where(eq(users.id, user.id));
  return true;
}
async function createFreeSubscription({
  userId,
  request
}) {
  const user = await db.query.users.findFirst({
    where: (users2, { eq: eq2 }) => eq2(users2.id, userId)
  });
  if (!user || !user.customer_id)
    throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const subscription = await db.query.subscriptions.findFirst({
    where: (subscriptions2, { eq: eq2 }) => eq2(subscriptions2.user_id, user.id)
  });
  if (subscription) return false;
  const currency = getLocaleCurrency(request);
  const plan = await db.query.plans.findFirst({
    where: (plan2, { eq: eq2 }) => eq2(plan2.id, PLANS.FREE),
    with: {
      prices: true
    }
  });
  const yearlyPrice = plan?.prices.find(
    (price) => price.interval === "year" && price.currency === currency
  );
  if (!yearlyPrice) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const stripeSubscription = await stripe.subscriptions.create({
    customer: String(user.customer_id),
    items: [{ price: yearlyPrice.id }]
  });
  if (!stripeSubscription) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  await db.insert(subscriptions).values({
    id: stripeSubscription.id,
    user_id: user.id,
    plan_id: String(stripeSubscription.items.data[0].plan.product),
    price_id: String(stripeSubscription.items.data[0].price.id),
    interval: String(stripeSubscription.items.data[0].plan.interval),
    status: stripeSubscription.status,
    current_period_start: stripeSubscription.current_period_start,
    current_period_end: stripeSubscription.current_period_end,
    cancel_at_period_end: stripeSubscription.cancel_at_period_end
  });
  return true;
}
async function createSubscriptionCheckout({
  userId,
  plan_id,
  planInterval,
  request
}) {
  const user = await db.query.users.findFirst({
    where: (users2, { eq: eq2 }) => eq2(users2.id, userId)
  });
  if (!user || !user.customer_id)
    throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const subscription = await db.query.subscriptions.findFirst({
    where: (subscriptions2, { eq: eq2 }) => eq2(subscriptions2.user_id, user.id)
  });
  if (subscription?.plan_id !== PLANS.FREE) return;
  const currency = getLocaleCurrency(request);
  const plan = await db.query.plans.findFirst({
    where: (plans, { eq: eq2 }) => eq2(plans.id, plan_id),
    with: { prices: true }
  });
  const price = plan?.prices.find(
    (price2) => price2.interval === planInterval && price2.currency === currency
  );
  if (!price) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const checkout = await stripe.checkout.sessions.create({
    customer: user.customer_id,
    line_items: [{ price: price.id, quantity: 1 }],
    mode: "subscription",
    payment_method_types: ["card"],
    success_url: `${HOST_URL}/dashboard/checkout`,
    cancel_url: `${HOST_URL}/dashboard/settings/billing`
  });
  if (!checkout) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  return checkout.url;
}
async function createCustomerPortal({ userId }) {
  const user = await db.query.users.findFirst({
    where: (users2, { eq: eq2 }) => eq2(users2.id, userId)
  });
  if (!user || !user.customer_id)
    throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  const customerPortal = await stripe.billingPortal.sessions.create({
    customer: user.customer_id,
    return_url: `${HOST_URL}/dashboard/settings/billing`
  });
  if (!customerPortal) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  return customerPortal.url;
}

const INTENTS = {
  INTENT: "INTENT",
  USER_UPDATE_USERNAME: "USER_UPDATE_USERNAME",
  USER_DELETE_ACCOUNT: "USER_DELETE_ACCOUNT",
  USER_DELETE: "USER_DELETE",
  SUBSCRIPTION_CREATE_CHECKOUT: "SUBSCRIPTION_CREATE_CHECKOUT",
  SUBSCRIPTION_CREATE_CUSTOMER_PORTAL: "SUBSCRIPTION_CREATE_CUSTOMER_PORTAL"
};

const ROUTE_PATH$d = "/dashboard/settings/billing";
const meta$5 = () => {
  return [{ title: "Remix SaaS - Billing" }];
};
async function loader$g({ request }) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: ROUTE_PATH$f
  });
  const subscription = await db.query.subscriptions.findFirst({
    where: (sub, { eq }) => eq(sub.user_id, sessionUser.id)
  });
  const currency = getLocaleCurrency(request);
  return json({ subscription, currency });
}
async function action$6({ request }) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: ROUTE_PATH$f
  });
  const formData = await request.formData();
  const intent = formData.get(INTENTS.INTENT);
  if (intent === INTENTS.SUBSCRIPTION_CREATE_CHECKOUT) {
    const plan_id = String(formData.get("plan_id"));
    const planInterval = String(formData.get("planInterval"));
    const checkoutUrl = await createSubscriptionCheckout({
      userId: sessionUser.id,
      plan_id,
      planInterval,
      request
    });
    if (!checkoutUrl) return json({ success: false });
    return redirect(checkoutUrl);
  }
  if (intent === INTENTS.SUBSCRIPTION_CREATE_CUSTOMER_PORTAL) {
    const customerPortalUrl = await createCustomerPortal({
      userId: sessionUser.id
    });
    if (!customerPortalUrl) return json({ success: false });
    return redirect(customerPortalUrl);
  }
  return json({});
}
function DashboardBilling() {
  const { subscription, currency } = useLoaderData();
  const [selectedplan_id, setSelectedplan_id] = useState(
    subscription?.plan_id ?? PLANS.FREE
  );
  const [selectedPlanInterval, setSelectedPlanInterval] = useState(
    INTERVALS.MONTH
  );
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2 p-6 py-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "This is a demo app." }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-normal text-primary/60", children: [
        "Remix SaaS is a demo app that uses Stripe test environment. You can find a list of test card numbers on the",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "https://stripe.com/docs/testing#cards",
            target: "_blank",
            rel: "noreferrer",
            className: "font-medium text-primary/80 underline",
            children: "Stripe docs"
          }
        ),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start rounded-lg border border-border bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Plan" }),
        /* @__PURE__ */ jsxs("p", { className: "flex items-start gap-1 text-sm font-normal text-primary/60", children: [
          "You are currently on the",
          " ",
          /* @__PURE__ */ jsx("span", { className: "flex h-[18px] items-center rounded-md bg-primary/10 px-1.5 text-sm font-medium text-primary/80", children: subscription ? subscription.plan_id?.charAt(0).toUpperCase() + subscription.plan_id.slice(1) : "Free" }),
          "plan."
        ] })
      ] }),
      subscription?.plan_id === PLANS.FREE && /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col items-center justify-evenly gap-2 border-border p-6 pt-0", children: Object.values(PRICING_PLANS).map((plan) => /* @__PURE__ */ jsxs(
        "div",
        {
          tabIndex: 0,
          role: "button",
          className: `flex w-full select-none items-center rounded-md border border-border hover:border-primary/60 ${selectedplan_id === plan.id && "border-primary/60"}`,
          onClick: () => setSelectedplan_id(plan.id),
          onKeyDown: (e) => {
            if (e.key === "Enter") setSelectedplan_id(plan.id);
          },
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start p-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-primary", children: plan.name }),
                plan.id !== PLANS.FREE && /* @__PURE__ */ jsxs("span", { className: "flex items-center rounded-md bg-primary/10 px-1.5 text-sm font-medium text-primary/80", children: [
                  currency === CURRENCIES.USD ? "$" : "€",
                  " ",
                  selectedPlanInterval === INTERVALS.MONTH ? plan.prices[INTERVALS.MONTH][currency] / 100 : plan.prices[INTERVALS.YEAR][currency] / 100,
                  " ",
                  "/ ",
                  selectedPlanInterval === INTERVALS.MONTH ? "month" : "year"
                ] })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-start text-sm font-normal text-primary/60", children: plan.description })
            ] }),
            plan.id !== PLANS.FREE && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  htmlFor: "interval-switch",
                  className: "text-start text-sm text-primary/60",
                  children: selectedPlanInterval === INTERVALS.MONTH ? "Monthly" : "Yearly"
                }
              ),
              /* @__PURE__ */ jsx(
                Switch,
                {
                  id: "interval-switch",
                  checked: selectedPlanInterval === INTERVALS.YEAR,
                  onCheckedChange: () => setSelectedPlanInterval(
                    (prev) => prev === INTERVALS.MONTH ? INTERVALS.YEAR : INTERVALS.MONTH
                  )
                }
              )
            ] })
          ]
        },
        plan.id
      )) }),
      subscription && subscription.plan_id !== PLANS.FREE && /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col items-center justify-evenly gap-2 border-border p-6 pt-0", children: /* @__PURE__ */ jsx("div", { className: "flex w-full items-center overflow-hidden rounded-md border border-primary/60", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-base font-medium text-primary", children: subscription.plan_id.charAt(0).toUpperCase() + subscription.plan_id.slice(1) }),
          /* @__PURE__ */ jsxs("p", { className: "flex items-start gap-1 text-sm font-normal text-primary/60", children: [
            subscription.cancel_at_period_end === true ? /* @__PURE__ */ jsx("span", { className: "flex h-[18px] items-center text-sm font-medium text-red-500", children: "Expires" }) : /* @__PURE__ */ jsx("span", { className: "flex h-[18px] items-center text-sm font-medium text-green-500", children: "Renews" }),
            "on:",
            " ",
            new Date(subscription.current_period_end * 1e3).toLocaleDateString(
              "en-US"
            ),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-start text-sm font-normal text-primary/60", children: PRICING_PLANS[PLANS.PRO].description })
      ] }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 py-3 dark:bg-card", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "You will not be charged for testing the subscription upgrade." }),
        subscription?.plan_id === PLANS.FREE && /* @__PURE__ */ jsxs(Form, { method: "POST", children: [
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "plan_id", value: selectedplan_id }),
          /* @__PURE__ */ jsx("input", { type: "hidden", name: "planInterval", value: selectedPlanInterval }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              name: INTENTS.INTENT,
              value: INTENTS.SUBSCRIPTION_CREATE_CHECKOUT,
              disabled: selectedplan_id === PLANS.FREE,
              children: "Upgrade to PRO"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start rounded-lg border border-border bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Manage Subscription" }),
        /* @__PURE__ */ jsx("p", { className: "flex items-start gap-1 text-sm font-normal text-primary/60", children: "Update your payment method, billing address, and more." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 py-3 dark:bg-card", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "You will be redirected to the Stripe Customer Portal." }),
        /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            name: INTENTS.INTENT,
            value: INTENTS.SUBSCRIPTION_CREATE_CUSTOMER_PORTAL,
            children: "Manage"
          }
        ) })
      ] })
    ] })
  ] });
}

const route17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$d,
  action: action$6,
  default: DashboardBilling,
  loader: loader$g,
  meta: meta$5
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$c = "/dashboard/settings";
const UsernameSchema$2 = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim().regex(/^[a-zA-Z0-9]+$/, "Username may only contain alphanumeric characters.")
});
const meta$4 = () => {
  return [{ title: "Settings" }];
};
async function loader$f({ request }) {
  const user = await requireUser(request);
  return json({ user });
}
function DashboardSettings$1() {
  const location = useLocation();
  const isSettingsPath = location.pathname === ROUTE_PATH$c;
  const isBillingPath = location.pathname === ROUTE_PATH$d;
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full px-6 py-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-screen-xl gap-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "hidden w-full max-w-64 flex-col gap-0.5 lg:flex", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: ROUTE_PATH$c,
          prefetch: "intent",
          className: cn(
            `${buttonVariants({ variant: "ghost" })} ${isSettingsPath && "bg-primary/5"} justify-start rounded-md`
          ),
          children: /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                `text-sm text-primary/80 ${isSettingsPath && "font-medium text-primary"}`
              ),
              children: "General"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: ROUTE_PATH$d,
          prefetch: "intent",
          className: cn(
            `${buttonVariants({ variant: "ghost" })} ${isBillingPath && "bg-primary/5"} justify-start rounded-md`
          ),
          children: /* @__PURE__ */ jsx(
            "span",
            {
              className: cn(
                `text-sm text-primary/80 ${isBillingPath && "font-medium text-primary"}`
              ),
              children: "Billing"
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Outlet, {})
  ] }) });
}

const route16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$c,
  UsernameSchema: UsernameSchema$2,
  default: DashboardSettings$1,
  loader: loader$f,
  meta: meta$4
}, Symbol.toStringTag, { value: 'Module' }));

function Header() {
  const location = useLocation();
  const allowedLocations = [ROUTE_PATH$i, ROUTE_PATH$d, ROUTE_PATH$c, ROUTE_PATH$b];
  const headerTitle = () => {
    if (location.pathname === ROUTE_PATH$i) return "Dashboard";
    if (location.pathname === ROUTE_PATH$d) return "Billing";
    if (location.pathname === ROUTE_PATH$c) return "Settings";
    if (location.pathname === ROUTE_PATH$b) return "Admin";
  };
  const headerDescription = () => {
    if (location.pathname === ROUTE_PATH$i)
      return "Manage your Apps and view your usage.";
    if (location.pathname === ROUTE_PATH$c) return "Manage your account settings.";
    if (location.pathname === ROUTE_PATH$d)
      return "Manage billing and your subscription plan.";
    if (location.pathname === ROUTE_PATH$b) return "Your admin dashboard.";
  };
  if (!allowedLocations.includes(location.pathname))
    return null;
  return /* @__PURE__ */ jsx("header", { className: "z-10 flex w-full flex-col border-b border-border bg-card px-6", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex w-full max-w-screen-xl items-center justify-between py-12", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-2", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-medium text-primary/80", children: headerTitle() }),
    /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-primary/60", children: headerDescription() })
  ] }) }) });
}

async function requireUserWithRole(request, name) {
  const user = await requireUser(request, { redirectTo: ROUTE_PATH$f });
  const hasRole = userHasRole(user, name);
  if (!hasRole) {
    throw json(
      {
        error: "Unauthorized",
        requiredRole: name,
        message: `Unauthorized: required role: ${name}`
      },
      { status: 403 }
    );
  }
  return user;
}

const ROUTE_PATH$b = "/admin";
const meta$3 = () => {
  return [{ title: `${siteConfig.siteTitle} - Admin` }];
};
async function loader$e({ request }) {
  const user = await requireUserWithRole(request, "admin");
  const subscription = await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.user_id, user.id)
  });
  return json({ user, subscription });
}
function Admin() {
  const { user, subscription } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[100vh] w-full flex-col bg-secondary dark:bg-black", children: [
    /* @__PURE__ */ jsx(TopNavigation, { user, plan_id: subscription?.plan_id }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("div", { className: "flex h-full w-full px-6 py-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-full w-full max-w-screen-xl gap-12", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black", children: [
      /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Customers" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Simple admin panel to manage your products and sales." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex w-full px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full border-b border-border" }) }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto flex w-full flex-col items-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card", children: [
        /* @__PURE__ */ jsxs("div", { className: "z-10 flex max-w-[460px] flex-col items-center gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40", children: /* @__PURE__ */ jsx(ShoppingBasket, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-primary", children: "Track your Sales" }),
            /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: "This is a simple Demo that you could use to manage your products and sales." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "z-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
          "a",
          {
            target: "_blank",
            rel: "noreferrer",
            href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
            className: cn(
              `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`
            ),
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Explore Documentation" }),
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "base-grid absolute h-full w-full opacity-40" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
      ] }) })
    ] }) }) })
  ] });
}

const route3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$b,
  default: Admin,
  loader: loader$e,
  meta: meta$3
}, Symbol.toStringTag, { value: 'Module' }));

function TopNavigation({ user, plan_id }) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const location = useLocation();
  const isAdminPath = location.pathname === ROUTE_PATH$b;
  const isDashboardPath = location.pathname === ROUTE_PATH$i;
  const isSettingsPath = location.pathname === ROUTE_PATH$c;
  const isBillingPath = location.pathname === ROUTE_PATH$d;
  return /* @__PURE__ */ jsxs("nav", { className: "sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-screen-xl items-center justify-between py-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: ROUTE_PATH$i,
            prefetch: "intent",
            className: "flex h-10 items-center gap-1",
            children: /* @__PURE__ */ jsx(Image, { src: Logo$1 })
          }
        ),
        /* @__PURE__ */ jsx(Slash, { className: "h-6 w-6 -rotate-12 stroke-[1.5px] text-primary/10" }),
        /* @__PURE__ */ jsxs(DropdownMenu, { modal: false, children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              className: "gap-2 px-2 data-[state=open]:bg-primary/5",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  user?.image?.id ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "h-8 w-8 rounded-full object-cover",
                      alt: user.username ?? user.email,
                      src: getUserImgSrc(user.image?.id)
                    }
                  ) : /* @__PURE__ */ jsx("span", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary/80", children: user?.username || "" }),
                  /* @__PURE__ */ jsx("span", { className: "flex h-5 items-center rounded-full bg-primary/10 px-2 text-xs font-medium text-primary/80", children: plan_id && plan_id.charAt(0).toUpperCase() + plan_id.slice(1) || "Free" })
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center justify-center", children: [
                  /* @__PURE__ */ jsx(ChevronUp, { className: "relative top-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" }),
                  /* @__PURE__ */ jsx(ChevronDown, { className: "relative bottom-[3px] h-[14px] w-[14px] stroke-[1.5px] text-primary/60" })
                ] })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { sideOffset: 8, className: "min-w-56 bg-card p-2", children: [
            /* @__PURE__ */ jsx(DropdownMenuLabel, { className: "flex items-center text-xs font-normal text-primary/60", children: "Personal Account" }),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "h-10 w-full cursor-pointer justify-between rounded-md bg-secondary px-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                user?.image?.id ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    className: "h-6 w-6 rounded-full object-cover",
                    alt: user.username ?? user.email,
                    src: getUserImgSrc(user.image?.id)
                  }
                ) : /* @__PURE__ */ jsx("span", { className: "h-6 w-6 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary/80", children: user?.username || "" })
              ] }),
              /* @__PURE__ */ jsx(Check, { className: "h-[18px] w-[18px] stroke-[1.5px] text-primary/60" })
            ] }),
            plan_id && plan_id === PLANS.FREE && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "mx-0 my-2" }),
              /* @__PURE__ */ jsx(DropdownMenuItem, { className: "p-0 focus:bg-transparent", children: /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  className: "w-full",
                  onClick: () => navigate(ROUTE_PATH$d),
                  children: "Upgrade to PRO"
                }
              ) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex h-10 items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "https://github.com/dev-xo/remix-saas/tree/main/docs#welcome-to-%EF%B8%8F-remix-saas-documentation",
            className: cn(
              `${buttonVariants({ variant: "outline", size: "sm" })} group hidden h-8 gap-2 rounded-full bg-transparent px-2 pr-2.5 md:flex`
            ),
            children: [
              /* @__PURE__ */ jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  className: "h-5 w-5 text-primary",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                  children: /* @__PURE__ */ jsx("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
                }
              ),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60 transition group-hover:text-primary group-focus:text-primary", children: "Documentation" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(DropdownMenu, { modal: false, children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "h-8 w-8 rounded-full", children: user?.image?.id ? /* @__PURE__ */ jsx(
            "img",
            {
              className: "min-h-8 min-w-8 rounded-full object-cover",
              alt: user.username ?? user.email,
              src: getUserImgSrc(user.image?.id)
            }
          ) : /* @__PURE__ */ jsx("span", { className: "min-h-8 min-w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }) }) }),
          /* @__PURE__ */ jsxs(
            DropdownMenuContent,
            {
              sideOffset: 8,
              className: "fixed -right-4 min-w-56 bg-card p-2",
              children: [
                /* @__PURE__ */ jsxs(DropdownMenuItem, { className: "group flex-col items-start focus:bg-transparent", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary", children: user?.username || "" }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-primary/60", children: user?.email })
                ] }),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "group h-9 w-full cursor-pointer justify-between rounded-md px-2",
                    onClick: () => navigate(ROUTE_PATH$c),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Settings" }),
                      /* @__PURE__ */ jsx(Settings, { className: "h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: cn(
                      "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent"
                    ),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Language" }),
                      /* @__PURE__ */ jsx(LanguageSwitcher, {})
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, { className: "mx-0 my-2" }),
                /* @__PURE__ */ jsxs(
                  DropdownMenuItem,
                  {
                    className: "group h-9 w-full cursor-pointer justify-between rounded-md px-2",
                    onClick: () => submit({}, { action: ROUTE_PATH$h, method: "POST" }),
                    children: [
                      /* @__PURE__ */ jsx("span", { className: "text-sm text-primary/60 group-hover:text-primary group-focus:text-primary", children: "Log Out" }),
                      /* @__PURE__ */ jsx(LogOut, { className: "h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" })
                    ]
                  }
                )
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex w-full max-w-screen-xl items-center gap-3", children: [
      user && userHasRole(user, "admin") && /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isAdminPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$b,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Admin"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isDashboardPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$i,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Dashboard"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isSettingsPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$c,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Settings"
            }
          )
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `flex h-12 items-center border-b-2 ${isBillingPath ? "border-primary" : "border-transparent"}`,
          children: /* @__PURE__ */ jsx(
            Link,
            {
              to: ROUTE_PATH$d,
              prefetch: "intent",
              className: cn(
                `${buttonVariants({ variant: "ghost", size: "sm" })} text-primary/80`
              ),
              children: "Billing"
            }
          )
        }
      )
    ] })
  ] });
}

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 100%;
`;
const ListContainerWithSearch = ({ searchTerm, onChange, children }) => {
  return /* @__PURE__ */ jsxs(ListContainer, { children: [
    /* @__PURE__ */ jsx(Input$1, { style: { height: 40, minHeight: 40, borderRadius: 4 }, placeholder: "Type to search...", value: searchTerm || "", onChange: (e) => onChange(e.target.value) }),
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

function useToast(toast$1) {
  useEffect(() => {
    if (toast$1) {
      setTimeout(() => {
        toast[toast$1.type](toast$1.title, {
          id: toast$1.id,
          description: toast$1.description
        });
      }, 0);
    }
  }, [toast$1]);
}

const Toaster = ({ theme, ...props }) => {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};

function GenericErrorBoundary({
  statusHandlers,
  defaultStatusHandler = ({ error }) => /* @__PURE__ */ jsxs("p", { children: [
    error.status,
    " ",
    error.status,
    " ",
    error.data
  ] }),
  unexpectedErrorHandler = (error) => /* @__PURE__ */ jsx("p", { children: getErrorMessage(error) })
}) {
  const params = useParams();
  const error = useRouteError();
  if (typeof document !== "undefined") {
    console.error(error);
  }
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col items-center justify-center", children: isRouteErrorResponse(error) ? (statusHandlers?.[error.status] ?? defaultStatusHandler)({
    error,
    params
  }) : unexpectedErrorHandler(error) });
}
function getErrorMessage(err) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof err.message === "string") {
    return err.message;
  }
  console.error("Unable to get error message for error:", err);
  return "Unknown error";
}

const ServerStyleContext = createContext(null);
const ClientStyleContext = createContext(null);

const indexStyles = "/assets/index-DD6iQd0z.css";

const NonceContext = createContext("");
NonceContext.Provider;
const useNonce = () => useContext(NonceContext);

const colors = {
  black: "#0c1015",
  gray: {
    "50": "#f9fafa",
    "100": "#f1f1f2",
    "200": "#e6e7e9",
    "300": "#d2d4d7",
    "400": "#a9adb2",
    "500": "#797f88",
    "600": "#4d5560",
    "700": "#2e3744",
    "800": "#19202b",
    "900": "#141a23"
  },
  pink: {
    "50": "#fdf5f9",
    "100": "#f8d8e8",
    "200": "#f3b9d6",
    "300": "#ec8cbc",
    "400": "#e66aa8",
    "500": "#dd3488",
    "600": "#c22473",
    "700": "#9f1e5e",
    "800": "#7c174a",
    "900": "#5c1137"
  },
  red: {
    "50": "#fdf5f5",
    "100": "#f9d9d9",
    "200": "#f3b7b7",
    "300": "#eb8b8b",
    "400": "#e77070",
    "500": "#e04545",
    "600": "#cb2626",
    "700": "#a41f1f",
    "800": "#8b1a1a",
    "900": "#661313"
  },
  orange: {
    "50": "#fefaf6",
    "100": "#f9ebdc",
    "200": "#f2d3b4",
    "300": "#e9b17a",
    "400": "#df9042",
    "500": "#ca7826",
    "600": "#aa6520",
    "700": "#885019",
    "800": "#6b3f14",
    "900": "#583410"
  },
  yellow: {
    "50": "#fefefc",
    "100": "#fcf9ec",
    "200": "#f5eec6",
    "300": "#eee09a",
    "400": "#e3cc59",
    "500": "#c1a724",
    "600": "#9a851d",
    "700": "#786817",
    "800": "#5a4e11",
    "900": "#4a400e"
  },
  green: {
    "50": "#f5fdf9",
    "100": "#c6f5dd",
    "200": "#81eab5",
    "300": "#29d981",
    "400": "#24be71",
    "500": "#1fa361",
    "600": "#198750",
    "700": "#14693e",
    "800": "#105633",
    "900": "#0d472a"
  },
  teal: {
    "50": "#effcfc",
    "100": "#b8f3f3",
    "200": "#70e7e7",
    "300": "#27d2d2",
    "400": "#21b3b3",
    "500": "#1c9898",
    "600": "#177b7b",
    "700": "#126060",
    "800": "#0f5050",
    "900": "#0c4242"
  },
  cyan: {
    "50": "#f3fbfd",
    "100": "#cceff6",
    "200": "#b5e8f3",
    "300": "#99e0ee",
    "400": "#40c4df",
    "500": "#27b5d1",
    "600": "#23a3bd",
    "700": "#1d879c",
    "800": "#186f80",
    "900": "#135663"
  },
  blue: {
    "50": "#f1f7fd",
    "100": "#cae0f6",
    "200": "#a3caf0",
    "300": "#78b0e8",
    "400": "#4e98e1",
    "500": "#2981d9",
    "600": "#226cb6",
    "700": "#1a528b",
    "800": "#154472",
    "900": "#11375d"
  },
  purple: {
    "50": "#f8f6fd",
    "100": "#e4daf9",
    "200": "#d0bff4",
    "300": "#b397ed",
    "400": "#9f7ae9",
    "500": "#8354e2",
    "600": "#6e37dd",
    "700": "#5a25c5",
    "800": "#4a1ea2",
    "900": "#371779"
  },
  primary: {
    "50": "#faf6fd",
    "100": "#eadaf9",
    "200": "#d7baf3",
    "300": "#c093ed",
    "400": "#b27ce9",
    "500": "#9f5be3",
    "600": "#8d3cde",
    "700": "#7425c3",
    "800": "#621fa6",
    "900": "#481779"
  }
};

const fonts = {
  heading: `'Inter Variable', sans-serif`,
  body: `'Inter Variable', sans-serif`
};

const globalStyles = {
  global: {
    // styles for the `body`
    body: {
      bg: "gray.400",
      color: "white"
    },
    // styles for the `a`
    input: {
      borderRadius: "4px",
      height: "40px"
    }
  }
};

const theme = extendTheme({
  globalStyles,
  colors,
  fonts
});

var define_process_env_default$1 = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const TOAST_SESSION_KEY = "_toast";
const TOAST_SESSION_FLASH_KEY = "_toast_flash";
const toastSessionStorage = createCookieSessionStorage({
  cookie: {
    name: TOAST_SESSION_KEY,
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: [define_process_env_default$1.SESSION_SECRET],
    secure: define_process_env_default$1.NODE_ENV === "production"
  }
});
const ToastSchema = z.object({
  description: z.string(),
  id: z.string().default(() => Math.random().toString(36).substring(2, 9)),
  title: z.string().optional(),
  type: z.enum(["message", "success", "error"]).default("message")
});
async function getToastSession(request) {
  const session = await toastSessionStorage.getSession(request.headers.get("Cookie"));
  const result = ToastSchema.safeParse(session.get(TOAST_SESSION_FLASH_KEY));
  const toast = result.success ? result.data : null;
  return {
    toast,
    headers: toast ? new Headers({
      "Set-Cookie": await toastSessionStorage.commitSession(session)
    }) : null
  };
}
async function createToastHeaders(toastInput) {
  const session = await toastSessionStorage.getSession();
  const toast = ToastSchema.parse(toastInput);
  session.flash(TOAST_SESSION_FLASH_KEY, toast);
  const cookie = await toastSessionStorage.commitSession(session);
  return new Headers({ "Set-Cookie": cookie });
}

const links = () => {
  return [
    { rel: "icon", href: favicon },
    { rel: "apple-touch-icon", href: Logo$1 },
    // { rel: "manifest", href: "/manifest.json" },
    { rel: "stylesheet", href: indexStyles }
  ];
};
async function loader$d({ request }) {
  const sessionUser = await authenticator.isAuthenticated(request);
  const user = sessionUser?.id ? await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, sessionUser?.id),
    with: {
      roles: {
        with: {
          role: true
        }
      }
    }
  }) : null;
  const { toast, headers: toastHeaders } = await getToastSession(request);
  const [csrfToken, csrfCookieHeader] = await csrf.commitToken();
  return json$1(
    {
      user,
      toast,
      csrfToken,
      honeypotProps: honeypot.getInputProps(),
      requestInfo: {
        origin: getDomainUrl(request),
        path: new URL(request.url).pathname
      }
    },
    {
      headers: combineHeaders(
        toastHeaders,
        csrfCookieHeader ? { "Set-Cookie": csrfCookieHeader } : null
      )
    }
  );
}
const Root = withEmotionCache((_, emotionCache) => {
  const { toast, csrfToken, honeypotProps } = useLoaderData();
  const nonce = useNonce();
  useToast(toast);
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
      /* @__PURE__ */ jsx("div", { id: "root", children: /* @__PURE__ */ jsx(ChakraProvider, { theme, children: /* @__PURE__ */ jsx(HoneypotProvider, { ...honeypotProps, children: /* @__PURE__ */ jsx(AuthenticityTokenProvider, { token: csrfToken, children: /* @__PURE__ */ jsx(Outlet, {}) }) }) }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, { nonce }),
      /* @__PURE__ */ jsx(Scripts, { nonce }),
      /* @__PURE__ */ jsx(Toaster, { closeButton: true, position: "bottom-center", theme: "system" })
    ] })
  ] });
});
const ErrorBoundary$1 = withEmotionCache((_, emotionCache) => {
  const nonce = useNonce();
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
      /* @__PURE__ */ jsx("div", { id: "root", children: /* @__PURE__ */ jsx(ChakraProvider, { theme, children: /* @__PURE__ */ jsx(
        GenericErrorBoundary,
        {
          statusHandlers: {
            403: ({ error }) => /* @__PURE__ */ jsxs("p", { children: [
              "You are not allowed to do that: ",
              error?.data.message
            ] })
          }
        }
      ) }) }),
      /* @__PURE__ */ jsx(ScrollRestoration, { nonce }),
      /* @__PURE__ */ jsx(Scripts, { nonce }),
      /* @__PURE__ */ jsx(Toaster, { closeButton: true, position: "bottom-center", theme: "system" })
    ] })
  ] });
});

const route0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ErrorBoundary: ErrorBoundary$1,
  default: Root,
  links,
  loader: loader$d
}, Symbol.toStringTag, { value: 'Module' }));

const meta$2 = () => {
  return [{ title: `${siteConfig.siteTitle} - 404 Not Found!` }];
};
async function loader$c() {
  throw new Response("Not found", { status: 404 });
}
function NotFound() {
  return /* @__PURE__ */ jsx(ErrorBoundary, {});
}
function ErrorBoundary() {
  return /* @__PURE__ */ jsx(
    GenericErrorBoundary,
    {
      statusHandlers: {
        404: () => /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full flex-col items-center justify-center gap-8 rounded-md bg-card px-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card hover:border-primary/40", children: /* @__PURE__ */ jsx(HelpCircle, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-2xl font-medium text-primary", children: "Whoops!" }),
            /* @__PURE__ */ jsx("p", { className: "text-center text-lg font-normal text-primary/60", children: "Nothing here yet!" })
          ] }),
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: ROUTE_PATH$i,
              prefetch: "intent",
              className: `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`,
              children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Return to Home" }),
                /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
              ]
            }
          )
        ] })
      }
    }
  );
}

const route1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: NotFound,
  loader: loader$c,
  meta: meta$2
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$a = "/";
const loader$b = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request);
  if (sessionUser) {
    return redirect(`/users`);
  } else {
    return redirect("/auth/login");
  }
};

const route2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$a,
  loader: loader$b
}, Symbol.toStringTag, { value: 'Module' }));

async function loader$a({ request }) {
  const user = await requireUserWithRole(request, "admin");
  return json({ user });
}
function AdminIndex() {
  return /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-2 p-6 py-2", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Get Started" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Explore the Admin Panel and get started with your first app." })
  ] });
}

const route4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: AdminIndex,
  loader: loader$a
}, Symbol.toStringTag, { value: 'Module' }));

function SubscriptionSuccessEmail({ email }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: "Successfully Subscribed to PRO" }),
    /* @__PURE__ */ jsx(
      Body,
      {
        style: {
          backgroundColor: "#ffffff",
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
        },
        children: /* @__PURE__ */ jsxs(Container$1, { style: { margin: "0 auto", padding: "20px 0 48px" }, children: [
          /* @__PURE__ */ jsx(
            Img,
            {
              src: "https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png",
              width: "40",
              height: "37",
              alt: ""
            }
          ),
          /* @__PURE__ */ jsxs(Text, { style: { fontSize: "16px", lineHeight: "26px" }, children: [
            "Hello ",
            email,
            "!"
          ] }),
          /* @__PURE__ */ jsxs(Text, { style: { fontSize: "16px", lineHeight: "26px" }, children: [
            "Your subscription to PRO has been successfully processed.",
            /* @__PURE__ */ jsx("br", {}),
            "We hope you enjoy the new features!"
          ] }),
          /* @__PURE__ */ jsxs(Text, { style: { fontSize: "16px", lineHeight: "26px" }, children: [
            "The ",
            /* @__PURE__ */ jsx(Link$1, { href: "http://localhost:3000", children: "domain-name.com" }),
            " team."
          ] }),
          /* @__PURE__ */ jsx(Hr, { style: { borderColor: "#cccccc", margin: "20px 0" } }),
          /* @__PURE__ */ jsx(Text, { style: { color: "#8898aa", fontSize: "12px" }, children: "200 domain-name.com" })
        ] })
      }
    )
  ] });
}
function SubscriptionErrorEmail({ email }) {
  return /* @__PURE__ */ jsxs(Html, { children: [
    /* @__PURE__ */ jsx(Head, {}),
    /* @__PURE__ */ jsx(Preview, { children: "Subscription Issue - Customer Support" }),
    /* @__PURE__ */ jsx(
      Body,
      {
        style: {
          backgroundColor: "#ffffff",
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
        },
        children: /* @__PURE__ */ jsxs(Container$1, { style: { margin: "0 auto", padding: "20px 0 48px" }, children: [
          /* @__PURE__ */ jsx(
            Img,
            {
              src: "https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-logo.png",
              width: "40",
              height: "37",
              alt: ""
            }
          ),
          /* @__PURE__ */ jsxs(Text, { style: { fontSize: "16px", lineHeight: "26px" }, children: [
            "Hello ",
            email,
            "."
          ] }),
          /* @__PURE__ */ jsxs(Text, { style: { fontSize: "16px", lineHeight: "26px" }, children: [
            "We were unable to process your subscription to PRO tier.",
            /* @__PURE__ */ jsx("br", {}),
            "But don't worry, we'll not charge you anything."
          ] }),
          /* @__PURE__ */ jsxs(Text, { style: { fontSize: "16px", lineHeight: "26px" }, children: [
            "The ",
            /* @__PURE__ */ jsx(Link$1, { href: "http://localhost:3000", children: "domain-name.com" }),
            " team."
          ] }),
          /* @__PURE__ */ jsx(Hr, { style: { borderColor: "#cccccc", margin: "20px 0" } }),
          /* @__PURE__ */ jsx(Text, { style: { color: "#8898aa", fontSize: "12px" }, children: "200 domain-name.com" })
        ] })
      }
    )
  ] });
}
function renderSubscriptionSuccessEmail(args) {
  return render(/* @__PURE__ */ jsx(SubscriptionSuccessEmail, { ...args }));
}
function renderSubscriptionErrorEmail(args) {
  return render(/* @__PURE__ */ jsx(SubscriptionErrorEmail, { ...args }));
}
async function sendSubscriptionSuccessEmail({
  email,
  subscriptionId
}) {
  const html = renderSubscriptionSuccessEmail({ email, subscriptionId });
  await sendEmail({
    to: email,
    subject: "Successfully Subscribed to PRO",
    html
  });
}
async function sendSubscriptionErrorEmail({
  email,
  subscriptionId
}) {
  const html = renderSubscriptionErrorEmail({ email, subscriptionId });
  await sendEmail({
    to: email,
    subject: "Subscription Issue - Customer Support",
    html
  });
}

var define_process_env_default = { NVM_INC: "/Users/jacob/.nvm/versions/node/v20.11.1/include/node", LC_FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", FIG_PID: "95532", SPACESHIP_VERSION: "3.16.5", TERM_PROGRAM: "iTerm.app", NODE: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", ANDROID_HOME: "/Users/jacob/Library/Android/sdk", NVM_CD_FLAGS: "-q", PYENV_ROOT: "/Users/jacob/.pyenv", TERM: "xterm-256color", SHELL: "/bin/zsh", FIGTERM_SESSION_ID: "10f70667-f120-4ebc-8d77-d479b2f66e80", HOMEBREW_REPOSITORY: "/opt/homebrew", TMPDIR: "/var/folders/1k/_j92pk2j113d__1z0xb6kg5w0000gn/T/", TERM_PROGRAM_VERSION: "3.5.2", TERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", npm_config_local_prefix: "/Users/jacob/projects/drizzle-app/", ZSH: "/Users/jacob/.oh-my-zsh", FIG_SET_PARENT_CHECK: "1", NVM_DIR: "/Users/jacob/.nvm", USER: "jacob", COMMAND_MODE: "unix2003", SSH_AUTH_SOCK: "/private/tmp/com.apple.launchd.Gxi2lSvyEO/Listeners", Q_SET_PARENT_CHECK: "1", __CF_USER_TEXT_ENCODING: "0x1F5:0x0:0x0", npm_execpath: "/Users/jacob/.bun/bin/bun", TERM_FEATURES: "T3LrMSc7UUw9Ts3BFGsSyHNoSxF", PAGER: "less", LSCOLORS: "Gxfxcxdxbxegedabagacad", TERMINFO_DIRS: "/Applications/iTerm.app/Contents/Resources/terminfo:/usr/share/terminfo", PATH: "/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/drizzle-app/node_modules/.bin:/Users/jacob/projects/node_modules/.bin:/Users/jacob/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/jacob/.local/share/fig/plugins/git-open:/Users/jacob/.bun/bin:/Users/jacob/.pyenv/shims:/Users/jacob/Library/Android/sdk/platform-tools:/Users/jacob/google-cloud-sdk/bin:/Users/jacob/.nvm/versions/node/v20.11.1/bin:/Users/jacob/.pyenv/bin:/Users/jacob/FlutterDev/flutter/bin:/Library/Frameworks/Python.framework/Versions/2.7/bin:/Users/jacob/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.7/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/X11/bin:/Library/Apple/usr/bin:/Library/TeX/texbin:/usr/local/share/dotnet:~/.dotnet/tools:/usr/local/go/bin:/usr/local/opt/liquibase:/Library/Frameworks/Mono.framework/Versions/Current/Commands:/Applications/Postgres.app/Contents/Versions/latest/bin:/Applications/Xamarin Workbooks.app/Contents/SharedSupport/path-bin:/Users/jacob/.cargo/bin:/Applications/iTerm.app/Contents/Resources/utilities:/Users/jacob/.local/bin:/Users/jacob/.fig/bin:/Users/FlutterDev/flutter/bin:/Users/jacob/.pub-cache/bin:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/lib:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/git:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/command-not-found:/Users/jacob/.antigen/bundles/robbyrussell/oh-my-zsh/plugins/docker:/Users/jacob/.antigen/bundles/zsh-users/zsh-completions:/Users/jacob/.antigen/bundles/zsh-users/zsh-autosuggestions:/Users/jacob/.antigen/bundles/zsh-users/zsh-syntax-highlighting:/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt:/Users/jacob/Library/Android/sdk/emulator:/Users/jacob/Library/Android/sdk/tools:/Users/jacob/Library/Android/sdk/tools/bin:/Users/jacob/Library/Android/sdk/platform-tools", npm_package_json: "/Users/jacob/projects/drizzle-app/package.json", _: "/Users/jacob/projects/drizzle-app/node_modules/.bin/remix", LaunchInstanceID: "CEEB4D20-9810-4713-A158-FAAA241A5365", SHELL_PID: "95532", __CFBundleIdentifier: "com.googlecode.iterm2", TTY: "/dev/ttys025", PWD: "/Users/jacob/projects/drizzle-app", npm_lifecycle_event: "build", npm_package_name: "drizzle-app", ANDROID_SDK: "/Users/jacob/Library/Android/sdk", LANG: "en_US.UTF-8", ITERM_PROFILE: "Default", Q_USING_ZSH_AUTOSUGGESTIONS: "1", XPC_FLAGS: "0x0", npm_package_version: "0.0.0", SPACESHIP_ROOT: "/Users/jacob/.antigen/bundles/denysdovhan/spaceship-prompt", XPC_SERVICE_NAME: "0", PYENV_SHELL: "zsh", SHLVL: "2", HOME: "/Users/jacob", COLORFGBG: "7;0", LC_TERMINAL_VERSION: "3.5.2", HOMEBREW_PREFIX: "/opt/homebrew", FIG_SET_PARENT: "10f70667-f120-4ebc-8d77-d479b2f66e80", ITERM_SESSION_ID: "w0t0p2:6269B6C8-C3BC-45E0-A4E7-416AE4752A3B", LESS: "-R", LOGNAME: "jacob", BUN_INSTALL: "/Users/jacob/.bun", NVM_BIN: "/Users/jacob/.nvm/versions/node/v20.11.1/bin", npm_config_user_agent: "bun/1.1.24 npm/? node/v22.3.0 darwin arm64", INFOPATH: "/opt/homebrew/share/info:", HOMEBREW_CELLAR: "/opt/homebrew/Cellar", Q_TERM: "1.3.2", QTERM_SESSION_ID: "2cbc17fc466040b2bd6511b173cef5ff", LC_TERMINAL: "iTerm2", DISPLAY: "/private/tmp/com.apple.launchd.HFvZv1Xje4/org.macosforge.xquartz:0", SQLITE_EXEMPT_PATH_FROM_VNODE_GUARDS: "/Users/jacob/Library/WebKit/Databases", SECURITYSESSIONID: "186b4", npm_node_execpath: "/Users/jacob/.nvm/versions/node/v20.11.1/bin/node", FIG_TERM: "2.19.0", COLORTERM: "truecolor", NODE_ENV: "development", VITE_USER_NODE_ENV: "development", HOST: "localhost", DB_PORT: "5432", DB_USER: "postgres", PASSWORD: "postgres", DB: "graphql", SESSION_SECRET: "6f537c18d0379354a860266b28aaad00", ENCRYPTION_SECRET: "aaa22dd88deea79f6fa0ebad83ecfc793ec4d8711e2f781a2fa7781b3a06cf69", RESEND_API_KEY: "re_7h5VCqyZ_L728svjYPciFTLqw9m7g145U", GITHUB_CLIENT_ID: "", GITHUB_CLIENT_SECRET: "", STRIPE_PUBLIC_KEY: "pk_test_51PqKpn026jDJK23TGnsbbMN4buMukP55MeVvP8KL9Vi1aTzAqAQ2Nl53TPHxm95JyfOYE8wYo1AKM7Lxvnktxc3M00T4Vk06T1", STRIPE_SECRET_KEY: "sk_test_51PqKpn026jDJK23TFgaMUr7ibSqAZcoA6kk9BdB3HYuqEJLfPSu347Y4dGNwCWgmAbWnuDwbyaJVUSEO58EqaIcF00UV8qhhIr", STRIPE_WEBHOOK_ENDPOINT: "whsec_cfee602ae3f38d3c0cbff5d0ef5e95936ef678cc1bfb2227349c3a4fba7a8c56", HONEYPOT_ENCRYPTION_SEED: "26d71defb3e71571f77d234d93a8425b193411beacb5c5dbacf5bbc2defe8fbd" };
const ROUTE_PATH$9 = "/api/webhook";
async function getStripeEvent(request) {
  try {
    const signature = request.headers.get("Stripe-Signature");
    if (!signature) throw new Error(ERRORS.STRIPE_MISSING_SIGNATURE);
    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      define_process_env_default.STRIPE_WEBHOOK_ENDPOINT
    );
    return event;
  } catch (err) {
    console.log(err);
    throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
  }
}
async function action$5({ request }) {
  const event = await getStripeEvent(request);
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { customer: customerId, subscription: subscriptionId } = z.object({ customer: z.string(), subscription: z.string() }).parse(session);
        const user = await db.query.users.findFirst({
          where: (users, { eq: eq2 }) => eq2(users.customer_id, customerId)
        });
        if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG);
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        await db.update(subscriptions).set({
          id: subscription.id,
          user_id: user.id,
          plan_id: String(subscription.items.data[0].plan.product),
          price_id: String(subscription.items.data[0].price.id),
          interval: String(subscription.items.data[0].plan.interval),
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end
        }).where(eq(subscriptions.user_id, user.id));
        await sendSubscriptionSuccessEmail({
          email: user.email,
          subscriptionId
        });
        const subscriptions$1 = (await stripe.subscriptions.list({ customer: customerId })).data.map((sub) => sub.items);
        if (subscriptions$1.length > 1) {
          const freeSubscription = subscriptions$1.find(
            (sub) => sub.data.some((item) => item.price.product === PLANS.FREE)
          );
          if (freeSubscription) {
            await stripe.subscriptions.cancel(
              freeSubscription?.data[0].subscription
            );
          }
        }
        return new Response(null);
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const { customer: customerId } = z.object({ customer: z.string() }).parse(subscription);
        const user = await db.query.users.findFirst({
          where: (users, { eq: eq2 }) => eq2(users.customer_id, customerId)
        });
        if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG);
        await db.update(subscriptions).set({
          id: subscription.id,
          user_id: user.id,
          plan_id: String(subscription.items.data[0].plan.product),
          price_id: String(subscription.items.data[0].price.id),
          interval: String(subscription.items.data[0].plan.interval),
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          cancel_at_period_end: subscription.cancel_at_period_end
        }).where(eq(subscriptions.user_id, user.id));
        return new Response(null);
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const { id } = z.object({ id: z.string() }).parse(subscription);
        const dbSubscription = await db.query.subscriptions.findFirst({
          where: (subs, { eq: eq2 }) => eq2(subs.id, id)
        });
        if (dbSubscription) {
          await db.delete(subscriptions).where(eq(subscriptions.id, dbSubscription.id));
        }
        return new Response(null);
      }
    }
  } catch (err) {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { customer: customerId, subscription: subscriptionId } = z.object({ customer: z.string(), subscription: z.string() }).parse(session);
        const user = await db.query.users.findFirst({
          where: (users, { eq: eq2 }) => eq2(users.customer_id, customerId)
        });
        if (!user) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
        await sendSubscriptionErrorEmail({ email: user.email, subscriptionId });
        return new Response(null);
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const { id: subscriptionId, customer: customerId } = z.object({ id: z.string(), customer: z.string() }).parse(subscription);
        const user = await db.query.users.findFirst({
          where: (users, { eq: eq2 }) => eq2(users.customer_id, customerId)
        });
        if (!user) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG);
        await sendSubscriptionErrorEmail({ email: user.email, subscriptionId });
        return new Response(null);
      }
    }
    throw err;
  }
  return new Response(null);
}

const route5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$9,
  action: action$5
}, Symbol.toStringTag, { value: 'Module' }));

const Logo = "/assets/logo_transparent-DEDR9GG9.png";

const ROUTE_PATH$8 = "/auth";
async function loader$9({ request }) {
  await authenticator.isAuthenticated(request, {
    successRedirect: ROUTE_PATH$i
  });
  const pathname = getDomainPathname(request);
  if (pathname === ROUTE_PATH$8) return redirect(ROUTE_PATH$f);
  return json({});
}
const QUOTES = [
  {
    quote: "There is nothing impossible to they who will try.",
    author: "Alexander the Great"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    quote: "The only thing we have to fear is fear itself.",
    author: "Franklin D. Roosevelt"
  }
];
function Layout() {
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-10 mx-auto flex -translate-x-1/2 transform lg:hidden", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: ROUTE_PATH$a,
        prefetch: "intent",
        className: "z-10 flex h-10 flex-col items-center justify-center gap-2",
        children: /* @__PURE__ */ jsx(Img$1, { src: Logo })
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "relative hidden h-full w-[50%] flex-col justify-between overflow-hidden bg-card p-10 lg:flex", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: ROUTE_PATH$a,
          prefetch: "intent",
          className: "z-10 flex h-10 w-10 items-center gap-1",
          children: /* @__PURE__ */ jsx(Img$1, { src: Logo })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex flex-col items-start gap-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-base font-normal text-primary", children: randomQuote.quote }),
        /* @__PURE__ */ jsxs("p", { className: "text-base font-normal text-primary/60", children: [
          "- ",
          randomQuote.author
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "base-grid absolute left-0 top-0 z-0 h-full w-full opacity-40" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex h-full w-full flex-col border-l border-primary/5 bg-card lg:w-[50%]", children: /* @__PURE__ */ jsx(Outlet, {}) })
  ] });
}

const route6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$8,
  default: Layout,
  loader: loader$9
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$7 = "/auth/:provider";
async function loader$8() {
  return redirect(ROUTE_PATH$f);
}
async function action$4({ request, params }) {
  if (typeof params.provider !== "string") throw new Error("Invalid provider.");
  return authenticator.authenticate(params.provider, request);
}

const route7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$7,
  action: action$4,
  loader: loader$8
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$6 = "/auth/:provider/callback";
async function loader$7({ request, params }) {
  if (typeof params.provider !== "string") throw new Error("Invalid provider.");
  return authenticator.authenticate(params.provider, request, {
    successRedirect: ROUTE_PATH$i,
    failureRedirect: ROUTE_PATH$f
  });
}

const route8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$6,
  loader: loader$7
}, Symbol.toStringTag, { value: 'Module' }));

const loader$6 = async () => {
  return redirect(`/dashboard/users`);
};

const route14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  loader: loader$6
}, Symbol.toStringTag, { value: 'Module' }));

function useInterval(callback, delay) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const ROUTE_PATH$5 = "/dashboard/checkout";
const meta$1 = () => {
  return [{ title: `${siteConfig.siteTitle} - Checkout` }];
};
async function loader$5({ request }) {
  const sessionUser = await requireSessionUser(request);
  const subscription = await db.query.subscriptions.findFirst({
    where: (sub, { eq }) => eq(sub.user_id, sessionUser.id)
  });
  if (!subscription) return redirect(ROUTE_PATH$i);
  return json({ isFreePlan: subscription.plan_id === PLANS.FREE });
}
function DashboardCheckout() {
  const { isFreePlan } = useLoaderData();
  const { revalidate } = useRevalidator();
  const [retries, setRetries] = useState(0);
  useInterval(
    () => {
      revalidate();
      setRetries(retries + 1);
    },
    isFreePlan && retries !== 3 ? 2e3 : null
  );
  return /* @__PURE__ */ jsx("div", { className: "flex h-full w-full bg-secondary px-6 py-8 dark:bg-black", children: /* @__PURE__ */ jsx("div", { className: "z-10 mx-auto flex h-full w-full max-w-screen-xl gap-12", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col rounded-lg border border-border bg-card dark:bg-black", children: [
    /* @__PURE__ */ jsx("div", { className: "flex w-full flex-col rounded-lg p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Completing your Checkout" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "We are completing your checkout, please wait ..." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex w-full px-6", children: /* @__PURE__ */ jsx("div", { className: "w-full border-b border-border" }) }),
    /* @__PURE__ */ jsx("div", { className: "relative mx-auto flex w-full  flex-col items-center p-6", children: /* @__PURE__ */ jsxs("div", { className: "relative flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg border border-border bg-secondary px-6 py-24 dark:bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "z-10 flex flex-col items-center gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-card hover:border-primary/40", children: [
          isFreePlan && retries < 3 && /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin stroke-[1.5px] text-primary/60" }),
          !isFreePlan && /* @__PURE__ */ jsx(BadgeCheck, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" }),
          isFreePlan && retries === 3 && /* @__PURE__ */ jsx(AlertTriangle, { className: "h-8 w-8 stroke-[1.5px] text-primary/60" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-2", children: /* @__PURE__ */ jsxs("p", { className: "text-center text-base font-medium text-primary", children: [
          isFreePlan && retries < 3 && "Completing your checkout ...",
          !isFreePlan && "Checkout completed!",
          isFreePlan && retries === 3 && "Something went wrong, but don't worry, you will not be charged."
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "z-10 flex items-center justify-center", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: ROUTE_PATH$i,
          prefetch: "intent",
          className: `${buttonVariants({ variant: "ghost", size: "sm" })} gap-2`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary/60 group-hover:text-primary", children: "Return to Dashboard" }),
            /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4 stroke-[1.5px] text-primary/60 group-hover:text-primary" })
          ]
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "base-grid absolute h-full w-full opacity-40" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 h-full w-full bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
    ] }) })
  ] }) }) });
}

const route15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$5,
  default: DashboardCheckout,
  loader: loader$5,
  meta: meta$1
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$4 = "/resources/reset-image";
async function action$3({ request }) {
  const user = await requireUser(request);
  await db.delete(user_images).where(eq(user_images.user_id, user.id));
  return null;
}

const route22 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$4,
  action: action$3
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$3 = "/resources/upload-image";
const MAX_FILE_SIZE = 1024 * 1024 * 3;
const ImageSchema = z.object({
  imageFile: z.instanceof(File).refine((file) => file.size > 0, "Image is required.")
});
async function action$2({ request }) {
  try {
    const user = await requireUser(request);
    const formData = await unstable_parseMultipartFormData(
      request,
      unstable_createMemoryUploadHandler({ maxPartSize: MAX_FILE_SIZE })
    );
    const submission = await parseWithZod(formData, {
      schema: ImageSchema.transform(async (data) => {
        return {
          image: {
            contentType: data.imageFile.type,
            blob: Buffer.from(await data.imageFile.arrayBuffer())
          }
        };
      }),
      async: true
    });
    if (submission.status !== "success") {
      return json(submission.reply(), {
        status: submission.status === "error" ? 400 : 200
      });
    }
    const { image } = submission.value;
    await db.transaction(async (tx) => {
      await tx.delete(user_images).where(eq(user_images.user_id, user.id));
      await tx.insert(user_images).values({
        content_type: image.contentType,
        blob: image.blob,
        user_id: user.id
      });
    });
    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: "Success!",
        description: "Image uploaded successfully."
      })
    });
  } catch (error) {
    if (error instanceof MaxPartSizeExceededError) {
      const result = {
        initialValue: {},
        status: "error",
        error: {
          imageFile: ["Image size must be less than 3MB."]
        },
        state: {
          validated: {
            imageFile: true
          }
        }
      };
      return json(result, { status: 400 });
    } else throw error;
  }
}

const route23 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ImageSchema,
  MAX_FILE_SIZE,
  ROUTE_PATH: ROUTE_PATH$3,
  action: action$2
}, Symbol.toStringTag, { value: 'Module' }));

function useDoubleCheck() {
  const [doubleCheck, setDoubleCheck] = useState(false);
  function getButtonProps(props) {
    const onBlur = () => setDoubleCheck(false);
    const onClick = doubleCheck ? void 0 : (e) => {
      e.preventDefault();
      setDoubleCheck(true);
    };
    const onKeyUp = (e) => {
      if (e.key === "Escape") {
        setDoubleCheck(false);
      }
    };
    return {
      ...props,
      onBlur: callAll(onBlur, props?.onBlur),
      onClick: callAll(onClick, props?.onClick),
      onKeyUp: callAll(onKeyUp, props?.onKeyUp)
    };
  }
  return { doubleCheck, getButtonProps };
}

const UsernameSchema$1 = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim().regex(/^[a-zA-Z0-9]+$/, "Username may only contain alphanumeric characters.")
});
async function loader$4({ request }) {
  const user = await requireUser(request);
  return json({ user });
}
async function action$1({ request }) {
  const user = await requireUser(request);
  const formData = await request.clone().formData();
  const intent = formData.get(INTENTS.INTENT);
  if (intent === INTENTS.USER_UPDATE_USERNAME) {
    const submission = parseWithZod(formData, { schema: UsernameSchema$1 });
    if (submission.status !== "success") {
      return json(submission.reply(), {
        status: submission.status === "error" ? 400 : 200
      });
    }
    const { username } = submission.value;
    const isUsernameTaken = await db.query.users.findFirst({ where: (user2, { eq: eq2 }) => eq2(user2.username, username) });
    if (isUsernameTaken) {
      return json(
        submission.reply({
          fieldErrors: {
            username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS]
          }
        })
      );
    }
    await db.update(users).set({ username }).where(eq(users.id, user.id));
    return json(submission.reply({ fieldErrors: {} }), {
      headers: await createToastHeaders({
        title: "Success!",
        description: "Username updated successfully."
      })
    });
  }
  if (intent === INTENTS.USER_DELETE_ACCOUNT) {
    await db.delete(users).where(eq(users.id, user.id));
    return redirect(ROUTE_PATH$a, {
      headers: {
        "Set-Cookie": await destroySession(
          await getSession(request.headers.get("Cookie"))
        )
      }
    });
  }
  throw new Error(`Invalid intent: ${intent}`);
}
function DashboardSettings() {
  const { user } = useLoaderData();
  const lastResult = useActionData();
  const [imageSrc, setImageSrc] = useState(null);
  const imageFormRef = useRef(null);
  const uploadImageFetcher = useFetcher();
  const resetImageFetcher = useFetcher();
  const { doubleCheck, getButtonProps } = useDoubleCheck();
  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema$1),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema$1 });
    }
  });
  const [avatarForm, avatarFields] = useForm({
    lastResult: uploadImageFetcher.data,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ImageSchema });
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "flex h-full w-full flex-col gap-6", children: [
    /* @__PURE__ */ jsxs(
      uploadImageFetcher.Form,
      {
        method: "POST",
        action: ROUTE_PATH$3,
        encType: "multipart/form-data",
        ref: imageFormRef,
        onReset: () => setImageSrc(null),
        ...getFormProps(avatarForm),
        className: "flex w-full flex-col items-start rounded-lg border border-border bg-card",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full items-start justify-between rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Your Avatar" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "This is your avatar. It will be displayed on your profile." })
            ] }),
            /* @__PURE__ */ jsxs(
              "label",
              {
                htmlFor: avatarFields.imageFile.id,
                className: "group relative flex cursor-pointer overflow-hidden rounded-full transition active:scale-95",
                children: [
                  imageSrc || user.image?.id ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: imageSrc ?? getUserImgSrc(user.image?.id),
                      className: "h-20 w-20 rounded-full object-cover",
                      alt: user.username ?? user.email
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "h-20 w-20 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" }),
                  /* @__PURE__ */ jsx("div", { className: "absolute z-10 hidden h-full w-full items-center justify-center bg-primary/40 group-hover:flex", children: /* @__PURE__ */ jsx(Upload, { className: "h-6 w-6 text-secondary" }) })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                ...getInputProps(avatarFields.imageFile, { type: "file" }),
                accept: "image/*",
                className: "peer sr-only",
                required: true,
                tabIndex: imageSrc ? -1 : 0,
                onChange: (e) => {
                  const file = e.currentTarget.files?.[0];
                  if (file) {
                    const form2 = e.currentTarget.form;
                    if (!form2) return;
                    const reader = new FileReader();
                    reader.onload = (readerEvent) => {
                      setImageSrc(readerEvent.target?.result?.toString() ?? null);
                      uploadImageFetcher.submit(form2);
                    };
                    reader.readAsDataURL(file);
                  }
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Click on the avatar to upload a custom one from your files." }),
            user.image?.id && !avatarFields.imageFile.errors && /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "secondary",
                onClick: () => {
                  resetImageFetcher.submit(
                    {},
                    {
                      method: "POST",
                      action: ROUTE_PATH$4
                    }
                  );
                  if (imageFormRef.current) {
                    imageFormRef.current.reset();
                  }
                },
                children: "Reset"
              }
            ),
            avatarFields.imageFile.errors && /* @__PURE__ */ jsx("p", { className: "text-right text-sm text-destructive dark:text-destructive-foreground", children: avatarFields.imageFile.errors.join(" ") })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        className: "flex w-full flex-col items-start rounded-lg border border-border bg-card",
        ...getFormProps(form),
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-4 rounded-lg p-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Your Username" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "This is your username. It will be displayed on your profile." })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Username",
                autoComplete: "off",
                defaultValue: user?.username ?? "",
                required: true,
                className: `w-80 bg-transparent ${username.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(username, { type: "text" })
              }
            ),
            username.errors && /* @__PURE__ */ jsx("p", { className: "text-sm text-destructive dark:text-destructive-foreground", children: username.errors.join(" ") })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-secondary px-6 dark:bg-card", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Please use 32 characters at maximum." }),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "submit",
                size: "sm",
                name: INTENTS.INTENT,
                value: INTENTS.USER_UPDATE_USERNAME,
                children: "Save"
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col items-start rounded-lg border border-destructive bg-card", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-medium text-primary", children: "Delete Account" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "Permanently delete your Remix SaaS account, all of your projects, links and their respective stats." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex min-h-14 w-full items-center justify-between rounded-lg rounded-t-none border-t border-border bg-red-500/10 px-6 dark:bg-red-500/10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-normal text-primary/60", children: "This action cannot be undone, proceed with caution." }),
        /* @__PURE__ */ jsx(Form, { method: "POST", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            variant: "destructive",
            name: INTENTS.INTENT,
            value: INTENTS.USER_DELETE_ACCOUNT,
            ...getButtonProps(),
            children: doubleCheck ? "Are you sure?" : "Delete Account"
          }
        ) })
      ] })
    ] })
  ] });
}

const route18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  UsernameSchema: UsernameSchema$1,
  action: action$1,
  default: DashboardSettings,
  loader: loader$4
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$2 = "/dashboard/users";
const loader$3 = async ({
  request
}) => {
  const url = new URL(request.url);
  const term = url.searchParams.get("query") || "";
  const data = await db.query.users.findMany({
    where: or(ilike(users.first_name, `%${term}%`), ilike(users.last_name, `%${term}%`), ilike(users.email, `%${term}%`)),
    with: {
      roles: {
        with: {
          role: true
        }
      }
    },
    limit: 100
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
    setSearchParams((prev) => {
      prev.set("query", searchTerm || "");
      return prev;
    });
  }, [searchTerm]);
  const users2 = useLoaderData();
  return /* @__PURE__ */ jsx(ListContainerWithSearch, { searchTerm, onChange: setSearchTerm, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(CardSkeletonList, { count: 10 }), children: /* @__PURE__ */ jsx(Await, { resolve: users2, children: (users3) => /* @__PURE__ */ jsxs(ListContainer, { children: [
    users3 && users3?.length === 0 && /* @__PURE__ */ jsx(ErrorComponent, { header: "No Users found...", text: "Try adjusting your query OR go get some users!" }),
    users3 && users3?.length > 0 && /* @__PURE__ */ jsx(ListContainer, { style: { overflow: "scroll", height: "100%" }, children: users3.map((user) => /* @__PURE__ */ jsx(Card, { variant: "outline", children: /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(Flex, { gap: "4", children: /* @__PURE__ */ jsxs(Flex, { flex: "1", gap: "4", alignItems: "center", flexWrap: "wrap", children: [
      /* @__PURE__ */ jsx(Avatar, { name: `${user.first_name} ${user.last_name}`, src: void 0 }),
      /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsx(Heading$1, { size: "sm", children: `${user.first_name} ${user.last_name}` }),
        /* @__PURE__ */ jsx(Text$1, { children: `${user.email} | ${user.phone_number}` })
      ] })
    ] }) }) }) }, user.id)) })
  ] }) }) }) });
};

const route19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$2,
  Users,
  default: Users,
  loader: loader$3
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH$1 = "/onboarding/username";
const UsernameSchema = z.object({
  username: z.string().min(3).max(20).toLowerCase().trim().regex(/^[a-zA-Z0-9]+$/, "Username may only contain alphanumeric characters.")
});
const meta = () => {
  return [{ title: "Remix SaaS - Username" }];
};
async function loader$2({ request }) {
  await requireSessionUser(request, { redirectTo: ROUTE_PATH$f });
  return json({});
}
async function action({ request }) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: ROUTE_PATH$f
  });
  const clonedRequest = request.clone();
  const formData = await clonedRequest.formData();
  await validateCSRF(formData, clonedRequest.headers);
  checkHoneypot(formData);
  const submission = parseWithZod(formData, { schema: UsernameSchema });
  if (submission.status !== "success") {
    return json(submission.reply(), { status: submission.status === "error" ? 400 : 200 });
  }
  const { username } = submission.value;
  const isUsernameTaken = await db.query.users.findFirst({ where: (user, { eq: eq2 }) => eq2(user.username, username) });
  if (isUsernameTaken) {
    return json(
      submission.reply({
        fieldErrors: {
          username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS]
        }
      })
    );
  }
  await db.update(users).set({ username }).where(eq(users.id, sessionUser.id));
  await createCustomer({ userId: sessionUser.id });
  const subscription = await db.query.subscriptions.findFirst({
    where: (sub, { eq: eq2 }) => eq2(sub.user_id, sessionUser.id)
  });
  if (!subscription) await createFreeSubscription({ userId: sessionUser.id, request });
  return redirect(ROUTE_PATH$i);
}
function OnboardingUsername() {
  const lastResult = useActionData();
  const inputRef = useRef(null);
  const isHydrated = useHydrated();
  const isPending = useIsPending();
  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema });
    }
  });
  useEffect(() => {
    isHydrated && inputRef.current?.focus();
  }, [isHydrated]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "mb-2 select-none text-6xl", children: "👋" }),
      /* @__PURE__ */ jsx("h3", { className: "text-center text-2xl font-medium text-primary", children: "Welcome!" }),
      /* @__PURE__ */ jsx("p", { className: "text-center text-base font-normal text-primary/60", children: "Let's get started by choosing a username." })
    ] }),
    /* @__PURE__ */ jsxs(
      Form,
      {
        method: "POST",
        autoComplete: "off",
        className: "flex w-full flex-col items-start gap-1",
        ...getFormProps(form),
        children: [
          /* @__PURE__ */ jsx(AuthenticityTokenInput, {}),
          /* @__PURE__ */ jsx(HoneypotInputs, {}),
          /* @__PURE__ */ jsxs("div", { className: "flex w-full flex-col gap-1.5", children: [
            /* @__PURE__ */ jsx("label", { htmlFor: "username", className: "sr-only", children: "Username" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Username",
                autoComplete: "off",
                ref: inputRef,
                required: true,
                className: `bg-transparent ${username.errors && "border-destructive focus-visible:ring-destructive"}`,
                ...getInputProps(username, { type: "text" })
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: username.errors && /* @__PURE__ */ jsx("span", { className: "mb-2 text-sm text-destructive dark:text-destructive-foreground", children: username.errors.join(" ") }) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", size: "sm", className: "w-full", children: isPending ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Continue" })
        ]
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "px-6 text-center text-sm font-normal leading-normal text-primary/60", children: "You can update your username at any time from your account settings." })
  ] });
}

const route21 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH: ROUTE_PATH$1,
  UsernameSchema,
  action,
  default: OnboardingUsername,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: 'Module' }));

const ROUTE_PATH = "/onboarding";
async function loader$1({ request }) {
  const user = await requireUser(request);
  const pathname = getDomainPathname(request);
  const isOnboardingPathname = pathname === ROUTE_PATH;
  const isOnboardingUsernamePathname = pathname === ROUTE_PATH$1;
  if (isOnboardingPathname) return redirect(ROUTE_PATH$i);
  if (user.username && isOnboardingUsernamePathname) return redirect(ROUTE_PATH$i);
  return json({});
}
function Onboarding() {
  return /* @__PURE__ */ jsxs("div", { className: "relative flex h-screen w-full bg-card", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute left-1/2 top-8 mx-auto -translate-x-1/2 transform justify-center", children: /* @__PURE__ */ jsx(Image, { src: Logo$1 }) }),
    /* @__PURE__ */ jsx("div", { className: "z-10 h-screen w-screen", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx("div", { className: "base-grid fixed h-screen w-screen opacity-40" }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 h-screen w-screen bg-gradient-to-t from-[hsl(var(--card))] to-transparent" })
  ] });
}

const route20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ROUTE_PATH,
  default: Onboarding,
  loader: loader$1
}, Symbol.toStringTag, { value: 'Module' }));

async function loader({ params }) {
  if (!params.imageId) {
    throw new Response("Image ID is required", { status: 400 });
  }
  const image = await db.query.user_images.findFirst({
    where: (image2, { eq }) => eq(image2.id, params.imageId || "")
  });
  if (!image) {
    throw new Response("Not found", { status: 404 });
  }
  return new Response(image.blob, {
    headers: {
      "Content-Type": image.content_type,
      "Content-Length": Buffer.byteLength(image.blob).toString(),
      "Content-Disposition": `inline; filename="${params.imageId}"`,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

const route24 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  loader
}, Symbol.toStringTag, { value: 'Module' }));

const serverManifest = {'entry':{'module':'/assets/entry.client-B24jrlqi.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/context-Bom512Hl.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js'],'css':[]},'routes':{'root':{'id':'root','parentId':undefined,'path':'','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':true,'module':'/assets/root-B6TruEoj.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/context-Bom512Hl.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/index-Bo67efd_.js','/assets/settings.billing-DS1kgzEA.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/index-BgCZZJbK.js','/assets/chunk-MFVQSVQB-CVhUmkHT.js','/assets/index-DP2QEwVW.js','/assets/honeypot-CR-XkuA3.js','/assets/logo-Cy4SmVqK.js','/assets/settings-_DqYphct.js','/assets/input-NQ8s9Axg.js','/assets/error-boundary-CqJGeTTS.js'],'css':['/assets/root-D_ja9IYN.css']},'routes/$':{'id':'routes/$','parentId':'root','path':'*','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':true,'module':'/assets/_-CscAKOeo.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/index-Bo67efd_.js','/assets/settings.billing-DS1kgzEA.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/index-BgCZZJbK.js','/assets/index-DP2QEwVW.js','/assets/settings-_DqYphct.js','/assets/input-NQ8s9Axg.js','/assets/brand-CzWodGQ6.js','/assets/error-boundary-CqJGeTTS.js','/assets/_layout-D_e90aji.js','/assets/external-link-CZJR-f7_.js'],'css':[]},'routes/_home+/_index':{'id':'routes/_home+/_index','parentId':'root','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_index-l0sNRNKZ.js','imports':[],'css':[]},'routes/admin+/_layout':{'id':'routes/admin+/_layout','parentId':'root','path':'admin','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_layout-DIB36B8q.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/index-Bo67efd_.js','/assets/settings.billing-DS1kgzEA.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/index-BgCZZJbK.js','/assets/index-DP2QEwVW.js','/assets/settings-_DqYphct.js','/assets/input-NQ8s9Axg.js','/assets/chunk-X3PS6RUF-CB4txRN1.js','/assets/chunk-SPIKMR6I-FgV4x53X.js','/assets/logo-Cy4SmVqK.js','/assets/_layout-D_e90aji.js','/assets/chunk-QINAG4RG-fAt24mT8.js','/assets/brand-CzWodGQ6.js','/assets/external-link-CZJR-f7_.js'],'css':[]},'routes/admin+/_index':{'id':'routes/admin+/_index','parentId':'routes/admin+/_layout','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_index-BeqBHeyz.js','imports':['/assets/jsx-runtime-DEmlPpso.js'],'css':[]},'routes/api+/webhook':{'id':'routes/api+/webhook','parentId':'root','path':'api/webhook','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/webhook-l0sNRNKZ.js','imports':[],'css':[]},'routes/auth+/_layout':{'id':'routes/auth+/_layout','parentId':'root','path':'auth','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_layout-BYJVFm1S.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/components-uhwHQdEV.js','/assets/chunk-X3PS6RUF-CB4txRN1.js'],'css':[]},'routes/auth+/$provider':{'id':'routes/auth+/$provider','parentId':'routes/auth+/_layout','path':':provider','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_provider-l0sNRNKZ.js','imports':[],'css':[]},'routes/auth+/$provider.callback':{'id':'routes/auth+/$provider.callback','parentId':'routes/auth+/$provider','path':'callback','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_provider.callback-l0sNRNKZ.js','imports':[],'css':[]},'routes/auth+/login':{'id':'routes/auth+/login','parentId':'routes/auth+/_layout','path':'login','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/login-CupLWAtR.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/index-BgCZZJbK.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/honeypot-CR-XkuA3.js','/assets/use-hydrated-BLDirVW-.js','/assets/input-NQ8s9Axg.js','/assets/brand-CzWodGQ6.js','/assets/parse-B9t2GImk.js','/assets/loader-circle-CVoCy50I.js'],'css':[]},'routes/auth+/logout':{'id':'routes/auth+/logout','parentId':'routes/auth+/_layout','path':'logout','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/logout-l0sNRNKZ.js','imports':[],'css':[]},'routes/auth+/magic-link':{'id':'routes/auth+/magic-link','parentId':'routes/auth+/_layout','path':'magic-link','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/magic-link-l0sNRNKZ.js','imports':[],'css':[]},'routes/auth+/verify':{'id':'routes/auth+/verify','parentId':'routes/auth+/_layout','path':'verify','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/verify-BJfXewgw.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/index-BgCZZJbK.js','/assets/use-hydrated-BLDirVW-.js','/assets/honeypot-CR-XkuA3.js','/assets/brand-CzWodGQ6.js','/assets/input-NQ8s9Axg.js','/assets/parse-B9t2GImk.js'],'css':[]},'routes/dashboard+/_layout':{'id':'routes/dashboard+/_layout','parentId':'root','path':'dashboard','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_layout-TtF8jUPh.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/index-Bo67efd_.js','/assets/settings.billing-DS1kgzEA.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/index-BgCZZJbK.js','/assets/index-DP2QEwVW.js','/assets/settings-_DqYphct.js','/assets/input-NQ8s9Axg.js','/assets/_layout-D_e90aji.js'],'css':[]},'routes/dashboard+/_index':{'id':'routes/dashboard+/_index','parentId':'routes/dashboard+/_layout','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_index-DP2rzg_V.js','imports':[],'css':[]},'routes/dashboard+/checkout':{'id':'routes/dashboard+/checkout','parentId':'routes/dashboard+/_layout','path':'checkout','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/checkout-DNMK561J.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/index-Bo67efd_.js','/assets/settings.billing-DS1kgzEA.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/index-BgCZZJbK.js','/assets/index-DP2QEwVW.js','/assets/settings-_DqYphct.js','/assets/input-NQ8s9Axg.js','/assets/_layout-D_e90aji.js','/assets/brand-CzWodGQ6.js','/assets/loader-circle-CVoCy50I.js','/assets/external-link-CZJR-f7_.js'],'css':[]},'routes/dashboard+/settings':{'id':'routes/dashboard+/settings','parentId':'routes/dashboard+/_layout','path':'settings','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/settings-pKOtGxZZ.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/index-BgCZZJbK.js','/assets/settings.billing-DS1kgzEA.js','/assets/settings-_DqYphct.js'],'css':[]},'routes/dashboard+/settings.billing':{'id':'routes/dashboard+/settings.billing','parentId':'routes/dashboard+/settings','path':'billing','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/settings.billing-DMYH7PkB.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/settings.billing-DS1kgzEA.js'],'css':[]},'routes/dashboard+/settings.index':{'id':'routes/dashboard+/settings.index','parentId':'routes/dashboard+/settings','path':undefined,'index':true,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/settings.index-BK0rV73Z.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/index-BgCZZJbK.js','/assets/input-NQ8s9Axg.js','/assets/upload-image-CT9KJohk.js','/assets/misc-CKFZHWnt.js','/assets/parse-B9t2GImk.js','/assets/createLucideIcon-CnhbPzUc.js'],'css':[]},'routes/dashboard+/users':{'id':'routes/dashboard+/users','parentId':'routes/dashboard+/_layout','path':'users','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/users-BSpIvoUz.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/misc-CKFZHWnt.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/index-Bo67efd_.js','/assets/settings.billing-DS1kgzEA.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/index-BgCZZJbK.js','/assets/index-DP2QEwVW.js','/assets/settings-_DqYphct.js','/assets/chunk-MFVQSVQB-CVhUmkHT.js','/assets/input-NQ8s9Axg.js','/assets/chunk-SPIKMR6I-FgV4x53X.js'],'css':[]},'routes/onboarding+/_layout':{'id':'routes/onboarding+/_layout','parentId':'root','path':'onboarding','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/_layout-ybZnYcw-.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/emotion-element-7a1343fa.browser.development.esm-BcZRTciY.js','/assets/chunk-ZJJGQIVY-B758PTVT.js','/assets/index-Bo67efd_.js','/assets/chunk-X3PS6RUF-CB4txRN1.js','/assets/chunk-SPIKMR6I-FgV4x53X.js','/assets/logo-Cy4SmVqK.js','/assets/index-DjyjHE6D.js','/assets/chunk-QINAG4RG-fAt24mT8.js'],'css':[]},'routes/onboarding+/username':{'id':'routes/onboarding+/username','parentId':'routes/onboarding+/_layout','path':'username','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/username-BXpkFmze.js','imports':['/assets/jsx-runtime-DEmlPpso.js','/assets/index-DjyjHE6D.js','/assets/components-uhwHQdEV.js','/assets/button-CpUPrY_9.js','/assets/index-BgCZZJbK.js','/assets/createLucideIcon-CnhbPzUc.js','/assets/honeypot-CR-XkuA3.js','/assets/use-hydrated-BLDirVW-.js','/assets/input-NQ8s9Axg.js','/assets/parse-B9t2GImk.js','/assets/loader-circle-CVoCy50I.js'],'css':[]},'routes/resources+/reset-image':{'id':'routes/resources+/reset-image','parentId':'root','path':'resources/reset-image','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/reset-image-l0sNRNKZ.js','imports':[],'css':[]},'routes/resources+/upload-image':{'id':'routes/resources+/upload-image','parentId':'root','path':'resources/upload-image','index':undefined,'caseSensitive':undefined,'hasAction':true,'hasLoader':false,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/upload-image-CT9KJohk.js','imports':['/assets/index-BgCZZJbK.js'],'css':[]},'routes/resources+/user-images.$imageId':{'id':'routes/resources+/user-images.$imageId','parentId':'root','path':'resources/user-images/:imageId','index':undefined,'caseSensitive':undefined,'hasAction':false,'hasLoader':true,'hasClientAction':false,'hasClientLoader':false,'hasErrorBoundary':false,'module':'/assets/user-images._imageId-l0sNRNKZ.js','imports':[],'css':[]}},'url':'/assets/manifest-a24d1796.js','version':'a24d1796'};

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
  "routes/$": {
          id: "routes/$",
          parentId: "root",
          path: "*",
          index: undefined,
          caseSensitive: undefined,
          module: route1
        },
  "routes/_home+/_index": {
          id: "routes/_home+/_index",
          parentId: "root",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route2
        },
  "routes/admin+/_layout": {
          id: "routes/admin+/_layout",
          parentId: "root",
          path: "admin",
          index: undefined,
          caseSensitive: undefined,
          module: route3
        },
  "routes/admin+/_index": {
          id: "routes/admin+/_index",
          parentId: "routes/admin+/_layout",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route4
        },
  "routes/api+/webhook": {
          id: "routes/api+/webhook",
          parentId: "root",
          path: "api/webhook",
          index: undefined,
          caseSensitive: undefined,
          module: route5
        },
  "routes/auth+/_layout": {
          id: "routes/auth+/_layout",
          parentId: "root",
          path: "auth",
          index: undefined,
          caseSensitive: undefined,
          module: route6
        },
  "routes/auth+/$provider": {
          id: "routes/auth+/$provider",
          parentId: "routes/auth+/_layout",
          path: ":provider",
          index: undefined,
          caseSensitive: undefined,
          module: route7
        },
  "routes/auth+/$provider.callback": {
          id: "routes/auth+/$provider.callback",
          parentId: "routes/auth+/$provider",
          path: "callback",
          index: undefined,
          caseSensitive: undefined,
          module: route8
        },
  "routes/auth+/login": {
          id: "routes/auth+/login",
          parentId: "routes/auth+/_layout",
          path: "login",
          index: undefined,
          caseSensitive: undefined,
          module: route9
        },
  "routes/auth+/logout": {
          id: "routes/auth+/logout",
          parentId: "routes/auth+/_layout",
          path: "logout",
          index: undefined,
          caseSensitive: undefined,
          module: route10
        },
  "routes/auth+/magic-link": {
          id: "routes/auth+/magic-link",
          parentId: "routes/auth+/_layout",
          path: "magic-link",
          index: undefined,
          caseSensitive: undefined,
          module: route11
        },
  "routes/auth+/verify": {
          id: "routes/auth+/verify",
          parentId: "routes/auth+/_layout",
          path: "verify",
          index: undefined,
          caseSensitive: undefined,
          module: route12
        },
  "routes/dashboard+/_layout": {
          id: "routes/dashboard+/_layout",
          parentId: "root",
          path: "dashboard",
          index: undefined,
          caseSensitive: undefined,
          module: route13
        },
  "routes/dashboard+/_index": {
          id: "routes/dashboard+/_index",
          parentId: "routes/dashboard+/_layout",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route14
        },
  "routes/dashboard+/checkout": {
          id: "routes/dashboard+/checkout",
          parentId: "routes/dashboard+/_layout",
          path: "checkout",
          index: undefined,
          caseSensitive: undefined,
          module: route15
        },
  "routes/dashboard+/settings": {
          id: "routes/dashboard+/settings",
          parentId: "routes/dashboard+/_layout",
          path: "settings",
          index: undefined,
          caseSensitive: undefined,
          module: route16
        },
  "routes/dashboard+/settings.billing": {
          id: "routes/dashboard+/settings.billing",
          parentId: "routes/dashboard+/settings",
          path: "billing",
          index: undefined,
          caseSensitive: undefined,
          module: route17
        },
  "routes/dashboard+/settings.index": {
          id: "routes/dashboard+/settings.index",
          parentId: "routes/dashboard+/settings",
          path: undefined,
          index: true,
          caseSensitive: undefined,
          module: route18
        },
  "routes/dashboard+/users": {
          id: "routes/dashboard+/users",
          parentId: "routes/dashboard+/_layout",
          path: "users",
          index: undefined,
          caseSensitive: undefined,
          module: route19
        },
  "routes/onboarding+/_layout": {
          id: "routes/onboarding+/_layout",
          parentId: "root",
          path: "onboarding",
          index: undefined,
          caseSensitive: undefined,
          module: route20
        },
  "routes/onboarding+/username": {
          id: "routes/onboarding+/username",
          parentId: "routes/onboarding+/_layout",
          path: "username",
          index: undefined,
          caseSensitive: undefined,
          module: route21
        },
  "routes/resources+/reset-image": {
          id: "routes/resources+/reset-image",
          parentId: "root",
          path: "resources/reset-image",
          index: undefined,
          caseSensitive: undefined,
          module: route22
        },
  "routes/resources+/upload-image": {
          id: "routes/resources+/upload-image",
          parentId: "root",
          path: "resources/upload-image",
          index: undefined,
          caseSensitive: undefined,
          module: route23
        },
  "routes/resources+/user-images.$imageId": {
          id: "routes/resources+/user-images.$imageId",
          parentId: "root",
          path: "resources/user-images/:imageId",
          index: undefined,
          caseSensitive: undefined,
          module: route24
        }
      };

export { serverManifest as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, mode, publicPath, routes };
