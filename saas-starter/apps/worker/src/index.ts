import { DurableObject } from "cloudflare:workers";
import { db, files } from "@grippd/sdk";
import { projects } from "@saas-starter/db";
import { and, isNotNull, lt } from "drizzle-orm";

// The bindings grippd generates in wrangler.jsonc.
interface Env {
  SWEEPER: DurableObjectNamespace<Sweeper>;
  ENVIRONMENT: "local" | "staging" | "production";
}

const KEEP_ARCHIVED_DAYS = 30;

// One Sweeper does the work, so two runs never overlap: a Durable Object handles one
// call at a time. It remembers its last run in its own storage.
export class Sweeper extends DurableObject<Env> {
  async sweep(now: number) {
    const cutoff = new Date(now - KEEP_ARCHIVED_DAYS * 24 * 60 * 60 * 1000);
    const gone = await db
      .delete(projects)
      .where(and(isNotNull(projects.archivedAt), lt(projects.archivedAt, cutoff)))
      .returning({ attachment: projects.attachment });
    await Promise.all(gone.flatMap((p) => (p.attachment ? [files.delete(p.attachment)] : [])));
    await this.ctx.storage.put("lastRun", { at: now, deleted: gone.length });
    return gone.length;
  }
}

export default {
  // Runs every hour (grippd.yaml). grippd watches the heartbeat and alerts if a run is missed.
  async scheduled(event, env) {
    const deleted = await env.SWEEPER.getByName("sweeper").sweep(event.scheduledTime);
    console.log(`deleted ${deleted} archived project(s)`);
  },
} satisfies ExportedHandler<Env>;
