# saas-starter

The richest template: a Turborepo monorepo with a team-only SvelteKit app, an hourly Worker with a Durable Object, public Astro docs, and a shared Drizzle database package. Three apps, one database, one bucket, and every key separate. It builds on `my-product`, the layout grippd was designed against, with working code in every app.

```yaml
name: saas-starter
database: postgres
files: true

apps:
  web:
    domain: app.example.com
    access: team
  worker:
    cron: every hour
  docs:
    public: true
```

## What grippd runs for it

<!-- grippd show -->
```
$ grippd show
# saas-starter on grippd

Runs in staging and production. Every push to main ships to staging; a v* tag promotes the same builds to production.

| App | Staging | Production |
| --- | --- | --- |
| web | web.staging.saas-starter.grippd.app, team only (@example.com) | app.example.com, team only (@example.com) |
| worker | every hour | every hour |
| docs | docs.staging.saas-starter.grippd.app, public | docs.saas-starter.grippd.app, public |

- **grippd Compute:** web (SvelteKit app), worker (Worker, with Sweeper) and docs (static site).
- **grippd Postgres:** one database per environment, used by web and worker, each with its own role. Migrations from packages/db run before the apps deploy.
- **grippd Cache:** every layer, browser to database, kept fresh on every write. No cache code.
- **grippd Storage:** one bucket per environment, used by web and worker.
- **grippd Monitor:** /healthz on web every minute and a heartbeat on worker's schedule.
- **grippd Backups:** nightly, off-site, immutable for 30 days, restore-tested weekly.
- **grippd Keys:** per environment, none shared, all expiring. web: a database role and a storage key; worker: a database role and a storage key; migrations: a database role that exists only while they run.

Custom domains: point a CNAME for app.example.com at grippd; the certificate is issued for you.
```
<!-- /grippd show -->

grippd works the rest out from the code: web and worker import `db` and `files` from `@grippd/sdk`, so each gets its own database role and storage key; docs imports neither, so it gets none. The migrations are the `.sql` files in `packages/db/migrations`. The worker's Durable Object is `export class Sweeper extends DurableObject`.

## What's in it

```
apps/
  web/        SvelteKit: projects with file attachments, behind the team-only sign-in
  worker/     Every hour, deletes projects archived over 30 days ago, and their files
  docs/       Astro, public, static
packages/
  db/         Drizzle schema and migrations, shared by web and worker
  grippd-sdk/ A stand-in for @grippd/sdk until it's on npm (see below)
grippd.yaml   The only infrastructure file
turbo.json    How each package is built and checked
```

## Deploy it

**Before you click, change `app.example.com` in `grippd.yaml` to a hostname you own.** `access: team` puts grippd's sign-in in front of that hostname, and today it lets in people whose email is at that domain (`@example.com` here). Then click **Deploy to grippd** on the gallery, or from a terminal:

```bash
grippd new --template saas-starter
```

You get your own fork. Point a CNAME for your hostname at grippd. Every push to `main` ships the apps Turborepo says changed to staging; a `v*` tag promotes the same builds to production.

## Working on it

```bash
bun install
grippd dev        # local Postgres and storage, then turbo runs every app's dev server
bun run check     # types, through turbo
bun run build
```

- **Signing in:** in staging and production, grippd's sign-in sits in front of web and passes the person's email to the app (`apps/web/src/hooks.server.ts`). `/healthz` stays open so grippd Monitor can reach it. Locally you're `you@localhost`.
- **Changing the schema:** edit `packages/db/src/schema.ts`, run `bun run generate` in `packages/db`, and commit the new migration. grippd runs it before the apps deploy, with a role that exists only while it runs.
- **`@grippd/sdk` isn't on npm yet.** `packages/grippd-sdk` is a workspace package with that name and the same `db` and `files` exports, built straight on the bindings grippd generates. Once the real package is out, delete the folder; the apps' `"@grippd/sdk": "workspace:*"` becomes a version.

## Files

| File | Who writes it |
| --- | --- |
| `grippd.yaml`, `apps/*/src`, `packages/`, `package.json` files, `turbo.json` | You |
| `apps/*/wrangler.jsonc`, `.github/workflows/grippd-*.yml`, `.github/grippd/`, `.github/actionlint.yaml`, `.gitattributes`, `grippd.lock` | grippd, from `grippd.yaml`. Don't edit them; CI fails if you do |
