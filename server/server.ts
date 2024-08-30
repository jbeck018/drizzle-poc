import crypto from "crypto";
import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pino from "pino-http";
import { Connection, Client } from '@temporalio/client';
import { syncSalesforceData } from '../temporal/data-syncing/workflows/sync-workflow';

installGlobals();

const NODE_ENV = process.env.NODE_ENV ?? "development";

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
// 		referrerPolicy: { policy: "same-origin" },
// 		crossOriginEmbedderPolicy: false,
// 		contentSecurityPolicy: {
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
// app.use((_, res, next) => {
// 	res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
// 	next();
// });

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

/**
 * Clean route paths. (No ending slashes, Better SEO)
 */
app.use((req, res, next) => {
	if (req.path.endsWith("/") && req.path.length > 1) {
		const query = req.url.slice(req.path.length);
		const safePath = req.path.slice(0, -1).replace(/\/+/g, "/");
		res.redirect(301, safePath + query);
	} else {
		next();
	}
});

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
app.listen(process.env.SERVER_PORT || 5000, () => {
	console.log(`App listening on http://localhost:${process.env.SERVER_PORT || 5000}`);
});

const connection = await Connection.connect({
	address: 'localhost:7233',
	tls: process.env.NODE_ENV === 'production' ? true : false,
  });

const temporalClient = new Client({
  connection,
  namespace: 'default',
});

app.post('/trigger-sync', async (req, res) => {
  const { objectType } = req.body;

  if (!objectType) {
    return res.status(400).json({ error: 'Object type is required' });
  }

  try {
    await temporalClient.workflow.start(syncSalesforceData, {
      args: [objectType],
      taskQueue: 'salesforce-sync',
      workflowId: `salesforce-sync-${objectType}-${Date.now()}`,
    });

    res.json({ message: `Sync started for ${objectType}` });
  } catch (error) {
    console.error('Error starting workflow:', error);
    res.status(500).json({ error: 'Failed to start sync workflow' });
  }
});

//Start it!
app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
