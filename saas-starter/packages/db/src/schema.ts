import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Everyone who gets past the team-only sign-in is on the team, so rows aren't scoped
// further. Add a team or org column when one deployment serves several customers.
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdBy: text("created_by").notNull(),
  // A path in grippd Storage, e.g. projects/<id>/brief.pdf.
  attachment: text("attachment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
});

export type Project = typeof projects.$inferSelect;
