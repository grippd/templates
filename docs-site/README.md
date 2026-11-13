# docs-site

A static Astro site anyone can open: Markdown pages, built to plain files and served from the edge. The simplest thing grippd runs, and its whole infrastructure is two lines.

```yaml
name: docs-site
public: true
```

## What grippd runs for it

<!-- grippd show -->
```
$ grippd show
# docs-site on grippd

Runs in staging and production. Every push to main ships to staging; a v* tag promotes the same builds to production.

| App | Staging | Production |
| --- | --- | --- |
| docs-site | staging.docs-site.grippd.app, public | docs-site.grippd.app, public |

- **grippd Compute:** docs-site (static site).
- **grippd Keys:** per environment, none shared, all expiring.
```
<!-- /grippd show -->

There's no database, storage or Worker code: Astro builds `dist/`, and grippd serves it.

## Deploy it

Click **Deploy to grippd** on the gallery, or from a terminal:

```bash
grippd new --template docs-site
```

You get your own fork. Every push to `main` ships to staging; a `v*` tag promotes the same build to production. To serve it on your own hostname, add `domain: docs.example.com` to `grippd.yaml` and point a CNAME at grippd.

## Working on it

```bash
bun install
grippd dev        # the dev server
bun run check
bun run build     # writes dist/
```

Add a page by adding a Markdown file under `src/pages/`; link it from `src/layouts/Page.astro`.

## Files

| File | Who writes it |
| --- | --- |
| `grippd.yaml`, `src/`, `astro.config.mjs`, `package.json` | You |
| `wrangler.jsonc`, `.github/workflows/grippd-*.yml`, `.github/grippd/`, `.github/actionlint.yaml`, `.gitattributes`, `grippd.lock` | grippd, from `grippd.yaml`. Don't edit them; CI fails if you do |
