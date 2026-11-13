# blog

A one-app SvelteKit blog: posts in Postgres through Drizzle, cover images in file storage. Its whole infrastructure is the six lines of `grippd.yaml`.

```yaml
name: blog
database: postgres
files: true
public: true
```

## What grippd runs for it

<!-- grippd show -->
```
$ grippd show
# blog on grippd

Runs in staging and production. Every push to main ships to staging; a v* tag promotes the same builds to production.

| App | Staging | Production |
| --- | --- | --- |
| blog | staging.blog.grippd.app, public | blog.grippd.app, public |

- **grippd Compute:** blog (SvelteKit app).
- **grippd Postgres:** one database per environment, used by blog with its own role. Migrations from drizzle run before the app deploys.
- **grippd Cache:** every layer, browser to database, kept fresh on every write. No cache code.
- **grippd Storage:** one bucket per environment, used by blog.
- **grippd Monitor:** /healthz on blog every minute.
- **grippd Backups:** nightly, off-site, immutable for 30 days, restore-tested weekly.
- **grippd Keys:** per environment, none shared, all expiring. blog: a database role and a storage key; migrations: a database role that exists only while they run.
```
<!-- /grippd show -->

## Deploy it

Click **Deploy to grippd** on the gallery, or from a terminal:

```bash
grippd new --template blog
```

Either way you get your own fork. Every push to `main` ships to staging; a `v*` tag promotes the same build to production. There are no keys, `.env` files or accounts to set up.

To serve it on your own hostname, add `domain: blog.example.com` to `grippd.yaml` and point a CNAME at grippd.

## Working on it

```bash
bun install
grippd dev        # local Postgres and storage, then the dev server
bun run check     # types
bun run build
```

- **Writing posts** is open only on your machine (`/new` under `grippd dev`), because the blog is public and has no sign-in. Add sign-in before opening it anywhere else.
- **Changing the schema:** edit `src/lib/server/schema.ts`, run `bun run generate`, and commit the new file in `drizzle/`. grippd runs migrations before each deploy.
- **`@grippd/sdk` isn't on npm yet.** `src/lib/grippd-sdk.ts` stands in for it with the same `db` and `files` exports, built straight on the bindings grippd generates. `vite.config.ts` says how to switch once it's published.

## Files

| File | Who writes it |
| --- | --- |
| `grippd.yaml`, `src/`, `drizzle/`, `package.json`, `vite.config.ts` | You |
| `wrangler.jsonc`, `.github/workflows/grippd-*.yml`, `.github/grippd/`, `.github/actionlint.yaml`, `.gitattributes`, `grippd.lock` | grippd, from `grippd.yaml`. Don't edit them; CI fails if you do |
