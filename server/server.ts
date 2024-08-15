import { buildSchema } from 'drizzle-graphql';
import { createYoga } from 'graphql-yoga';
import { db } from '../db';

const { schema } = buildSchema(db);

const yoga = createYoga({ 
    schema,
    cors: request => {
        const requestOrigin = request.headers.get('origin')
        return {
          origin: requestOrigin as string,
          credentials: true,
          allowedHeaders: ['X-Custom-Header'],
          methods: ['POST']
        }
      },
    batching: {
        limit: 5,
    },
    graphiql: {
        defaultQuery: /* GraphQL */ `
        query {
          hello
        }
      `,
    }
 });

 const server = Bun.serve({
    port: 3100,
    fetch: yoga as any,
  })
   
  console.info(
    `Server is running on ${new URL(
      yoga.graphqlEndpoint,
      `http://${server.hostname}:${server.port}`
    )}`
  )