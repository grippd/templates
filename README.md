# grippd templates

Public. Each folder is a project that deploys with one click: a `grippd.yaml` plus code. `grippd new --template <name>` and the "Deploy to grippd" button start from these, and each one shows how small the file can be.

| Template | What it is |
| --- | --- |
| `my-product/` | The platform-template monorepo: SvelteKit web, a jobs Worker, Astro docs, Postgres and file storage. The repo the product was designed against |

## Rules for a template

- It works with nothing but its `grippd.yaml`: no keys, no `.env`, no setup steps.
- Its generated files are current. CI runs `grippd check` on every template.
- It names grippd's products, never the suppliers underneath.

The gallery's plan is in the monorepo's `brain/ideas/one-click-templates.md`.
