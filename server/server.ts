// const { schema } = buildSchema(db);
import crypto from "crypto";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import compression from "compression";
import cors from "cors";
import express from "express";
// import helmet from "helmet";
import pino from "pino-http";
// import { buildSchema } from "drizzle-graphql";
// import { createYoga } from "graphql-yoga";
import { db } from "../db/db.server";

installGlobals();

const NODE_ENV = process.env.NODE_ENV ?? "development";

// const yoga = createYoga({
// 	schema,
// 	graphqlEndpoint: "/graphql",
// 	graphiql: true,
// 	batching: { limit: 5 },
// });

const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			);

const build = viteDevServer
	? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
	: await import("../build/server/index.js");

const app = express();

//Pino Logger;
app.use(
	pino({
		level: process.env.NODE_ENV === "production" ? "error" : "info",
	}),
);

//CORS:
app.use(cors({ origin: "*" }));
/**
 * Good practices: Disable x-powered-by.
 * @see http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
 */
app.disable("x-powered-by");

app.use(compression());

// app.use(
// 	helmet({
// 		contentSecurityPolicy: {
// 			referrerPolicy: { policy: "same-origin" },
// 			crossOriginEmbedderPolicy: false,
// 			// ❗Important: Remove `reportOnly` to enforce CSP. (Development only).
// 			reportOnly: true,
// 			directives: {
// 				// Controls allowed endpoints for fetch, XHR, WebSockets, etc.
// 				"connect-src": [
// 					NODE_ENV === "development" ? "ws:" : null,
// 					"'self'",
// 				].filter(Boolean) as string[],
// 				// Defines which origins can serve fonts to your site.
// 				"font-src": ["'self'"],
// 				// Specifies origins allowed to be embedded as frames.
// 				"frame-src": ["'self'"],
// 				// Determines allowed sources for images.
// 				"img-src": ["'self'", "data:"],
// 				// Sets restrictions on sources for <script> elements.
// 				"script-src": [
// 					"'strict-dynamic'",
// 					"'self'",
// 					(_, res) => `'nonce-${res["locals"].cspNonce}'`,
// 				],
// 				// Controls allowed sources for inline JavaScript event handlers.
// 				"script-src-attr": [(_, res) => `'nonce-${res["locals"].cspNonce}'`],
// 				// Enforces that requests are made over HTTPS.
// 				"upgrade-insecure-requests": null,
// 			},
// 		},
// 	}),
// );

/**
 * Content Security Policy.
 * Implementation based on github.com/epicweb-dev/epic-stack
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 */
app.use((_, res, next) => {
	res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
	next();
});

// handle asset requests for vite.
// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	app.use(
		"/assets",
		express.static("build/client/assets", {
			immutable: true,
			maxAge: "1y",
		}),
	);
}
app.use(express.static("build/client", { maxAge: "1h" }));

// handle SSR requests
app.all(
	"*",
	createRequestHandler({
		build: build as any,
	}),
);

//Graphql
// app.use(yoga.graphqlEndpoint, yoga);

//Start it!
app.listen(5000, () => {
	console.log("App listening on http://localhost:5000");
});
