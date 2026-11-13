# grippd templates

Public. Each folder is a project that deploys with one click: a `grippd.yaml` plus code. `grippd new --template <name>` and the "Deploy to grippd" button start from these, and each one shows how small the file can be.

| Template | What it is | Its `grippd.yaml` |
| --- | --- | --- |
| [`blog/`](blog) | One SvelteKit app: posts in Postgres through Drizzle, cover images in file storage | `database`, `files`, `public` |
| [`docs-site/`](docs-site) | A static Astro site anyone can open. The simplest case | `public` |
| [`cron-worker/`](cron-worker) | A Worker on a schedule, keeping its results in a Durable Object | `cron` |
| [`saas-starter/`](saas-starter) | The richest: a Turborepo monorepo with a team-only SvelteKit app, an hourly Worker with a Durable Object, public Astro docs and a shared Drizzle package | `database`, `files`, three `apps` |
| [`my-product/`](my-product) | The platform-template monorepo as it looks after grippd has run: the repo the product was designed against. It shows the generated files; its apps have no real code, so it isn't built | `database`, `files`, three `apps` |

Each template's README shows what grippd runs for it (`grippd show`) and how to deploy it.

## Rules for a template

- It works with nothing but its `grippd.yaml`: no keys, no `.env`, no setup steps.
- Its generated files are current. CI runs `grippd check` on every template.
- It builds: `bun install`, then `bun run check` and `bun run build`, with a committed `bun.lock`.
- It names grippd's products, never the suppliers underneath.

## Checking them

```bash
bun run check      # every template: grippd check, README current, install, type-check, build
bun run update     # regenerate every template's generated files and README block
```

Both take template names to do just those (`bun run check blog`). They use `grippd` from the PATH, or `$GRIPPD` if set. CI (`.github/workflows/check.yml`) runs `bun run check` with the CLI release in `GRIPPD_VERSION`.

## Not there yet

- **`@grippd/sdk` isn't on npm.** Templates that use the database or files carry a small stand-in with the same `db` and `files` exports, built straight on the generated bindings: `src/lib/grippd-sdk.ts` in `blog`, the `packages/grippd-sdk` workspace in `saas-starter`. Each README says how to switch.
- **CI needs the first CLI release.** The workflow downloads `grippd` from this organisation's `homebrew-tap` releases, which don't exist until the monorepo tags `cli-v0.1.0`.
- **`saas-starter` needs one edit before it deploys:** `app.example.com` becomes your hostname, because `access: team` needs a domain. The other templates use the `grippd.app` address grippd gives every app.
- **The deploy button and gallery** aren't built; `grippd new --template` isn't either.

The gallery's plan is in the monorepo's `brain/ideas/one-click-templates.md`.
