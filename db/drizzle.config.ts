import { defineConfig } from "drizzle-kit";
// console.log(process.env);
export default defineConfig({
  dialect: "postgresql",
  schema: "./db/schema/index.ts",
  out: "./db/drizzle",
  dbCredentials: {
    host: process.env.HOST || "127.0.0.1",
    port: process.env.PORT as unknown as number || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.PASSWORD || "postgres",
    database: process.env.DB || "graphql",
    ssl: false,
  }
});