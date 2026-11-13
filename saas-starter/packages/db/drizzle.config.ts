import { defineConfig } from "drizzle-kit";

// `bun run generate` writes a new migration into migrations/ after a schema change.
// grippd runs them before each deploy, with a database role that exists only while they run.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
});
