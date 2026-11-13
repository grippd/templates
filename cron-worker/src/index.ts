import { DurableObject } from "cloudflare:workers";
import { targets } from "./targets";

// The bindings grippd puts in wrangler.jsonc.
interface Env {
  UPTIME_LOG: DurableObjectNamespace<UptimeLog>;
  ENVIRONMENT: "local" | "staging" | "production";
}

interface Check {
  url: string;
  status: number;
  ms: number;
}

// One Durable Object holds every result in its own SQLite storage. grippd backs it up
// with the Worker; there's no database to declare.
export class UptimeLog extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    ctx.storage.sql.exec(`create table if not exists checks (
      at integer not null, url text not null, status integer not null, ms integer not null)`);
  }

  record(at: number, checks: Check[]) {
    for (const c of checks) {
      this.ctx.storage.sql.exec("insert into checks values (?, ?, ?, ?)", at, c.url, c.status, c.ms);
    }
    // Keep a week.
    this.ctx.storage.sql.exec("delete from checks where at < ?", at - 7 * 24 * 60 * 60 * 1000);
  }

  // The share of checks in the last day that came back 2xx or 3xx, per URL.
  uptime(since: number) {
    return this.ctx.storage.sql
      .exec<{ url: string; up: number }>(
        "select url, avg(status between 200 and 399) as up from checks where at >= ? group by url",
        since,
      )
      .toArray();
  }
}

async function check(url: string): Promise<Check> {
  const start = Date.now();
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "manual", signal: AbortSignal.timeout(10_000) });
    return { url, status: res.status, ms: Date.now() - start };
  } catch {
    return { url, status: 0, ms: Date.now() - start };
  }
}

export default {
  // Runs every 15 minutes (grippd.yaml). grippd watches the heartbeat and alerts if a run is missed.
  async scheduled(event, env) {
    const checks = await Promise.all(targets.map(check));
    const log = env.UPTIME_LOG.getByName("log");
    await log.record(event.scheduledTime, checks);
    for (const { url, up } of await log.uptime(event.scheduledTime - 24 * 60 * 60 * 1000)) {
      console.log(`${url}: ${(up * 100).toFixed(1)}% up in the last day`);
    }
  },
} satisfies ExportedHandler<Env>;
