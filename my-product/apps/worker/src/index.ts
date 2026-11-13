import { DurableObject } from "cloudflare:workers";
import { db } from "@grippd/sdk";

export class JobRunner extends DurableObject {
  async sweep() {
    await db`delete from items where archived_at < now() - interval '30 days'`;
  }
}

export default {
  // Runs every 15 minutes (grippd.yaml). grippd watches the heartbeat.
  async scheduled(_event, env) {
    await env.JOB_RUNNER.getByName("sweep").sweep();
  },
} satisfies ExportedHandler<Env>;
