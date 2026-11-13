import { defineConfig } from "drizzle-kit";

// `bun run generate` writes a new migration into drizzle/ after a schema change.
// grippd runs the migrations before each deploy; you never run them by hand.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/server/schema.ts",
  out: "./drizzle",
});
