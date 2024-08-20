// import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import * as dbSchema from './schema';

const client = new Client({
  host: process.env.HOST || "127.0.0.1",
  port: process.env.DB_PORT as unknown as number || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.PASSWORD || "password",
  database: process.env.DB || "graphql",
  ssl: false,
});

await client.connect();
export const db = drizzle(client, { schema: dbSchema });