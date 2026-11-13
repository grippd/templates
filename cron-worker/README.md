# cron-worker

A Worker that runs on a schedule: every 15 minutes it checks a few URLs and keeps a week of results in a Durable Object's own SQLite storage. No web address, no database: the infrastructure is two lines.

```yaml
name: cron-worker
cron: every 15 minutes
```

grippd finds the Durable Object (`export class UptimeLog extends DurableObject`) in `src/index.ts` and adds its binding and migration itself.

## What grippd runs for it

<!-- grippd show -->
```
$ grippd show
# cron-worker on grippd

Runs in staging and production. Every push to main ships to staging; a v* tag promotes the same builds to production.

| App | Staging | Production |
| --- | --- | --- |
| cron-worker | every 15 minutes | every 15 minutes |

- **grippd Compute:** cron-worker (Worker, with UptimeLog).
- **grippd Monitor:** a heartbeat on cron-worker's schedule.
- **grippd Keys:** per environment, none shared, all expiring.
```
<!-- /grippd show -->

## Deploy it

Click **Deploy to grippd** on the gallery, or from a terminal:

```bash
grippd new --template cron-worker
```

You get your own fork. Every push to `main` ships to staging; a `v*` tag promotes the same build to production. If a scheduled run is missed, grippd Monitor alerts.

## Working on it

```bash
bun install
bun run check
bun run build                       # bundles to dist/ without deploying
grippd dev                          # runs the Worker locally
```

Edit the URLs in `src/targets.ts`. Results show in the Worker's logs, one line per URL with its uptime over the last day. Change the schedule in `grippd.yaml` (`every minute`, `every hour`, `every day at 03:00`); grippd rewrites the trigger.

## Files

| File | Who writes it |
| --- | --- |
| `grippd.yaml`, `src/`, `package.json`, `tsconfig.json` | You |
| `wrangler.jsonc`, `.github/workflows/grippd-*.yml`, `.github/grippd/`, `.github/actionlint.yaml`, `.gitattributes`, `grippd.lock` | grippd, from `grippd.yaml`. Don't edit them; CI fails if you do |
