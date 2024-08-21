import { createYoga } from 'graphql-yoga';
import { buildSchema } from 'drizzle-graphql';
import { db } from '../db/db.server';
import { installGlobals } from "@remix-run/node";
const { schema } = buildSchema(db);
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import pino from 'pino-http';
import cors from 'cors';

const yoga = createYoga({ schema, graphqlEndpoint: '/graphql', graphiql: true, batching: { limit: 5 } });

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then((vite) =>
        vite.createServer({
          server: { middlewareMode: true },
        })
      );

const build = viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
          "virtual:remix/server-build"
        )
    : await import("../build/server/index.js");


const app = express();

//Pino Logger;
app.use(
  pino({
    level: process.env.NODE_ENV === "production" ? "error" : "info",
  })
)

//CORS:
app.use(cors({ origin: '*' }))

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
      })
    );
  }
  app.use(express.static("build/client", { maxAge: "1h" }));
  
  // handle SSR requests
  app.all(
    "*",
    createRequestHandler({
      build: build as any,
    })
  );

//Graphql
app.use(yoga.graphqlEndpoint, yoga)

//Start it!
app.listen(5000, () => {
  console.log("App listening on http://localhost:5000");
})