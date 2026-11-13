import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  slug: text("slug").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  // A path in grippd Storage, e.g. covers/hello-world.
  cover: text("cover"),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull().defaultNow(),
});
