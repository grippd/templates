// What CI runs on every template: generated files current, README current, install,
// type-check and build. Exits non-zero if any template fails.
//   bun scripts/check.ts [template...]
import { $ } from "bun";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { buildless, grippd, root, showBlock, templates } from "./lib";

const failed: string[] = [];

for (const name of templates(process.argv.slice(2))) {
  const dir = join(root, name);
  console.log(`\n== ${name}`);
  try {
    await $`${grippd} check ${dir}`;
    const block = await showBlock(dir);
    if (block && block.current !== block.wanted) {
      throw new Error("README's grippd show block is out of date: run bun scripts/update.ts");
    }
    if (buildless.has(name)) {
      console.log("no app code to build");
      continue;
    }
    if (!existsSync(join(dir, "bun.lock"))) throw new Error("no bun.lock: run bun install in it");
    const pkg = await Bun.file(join(dir, "package.json")).json();
    await $`bun install --frozen-lockfile`.cwd(dir);
    if (pkg.scripts?.check) await $`bun run check`.cwd(dir);
    await $`bun run build`.cwd(dir);
  } catch (e) {
    console.error(e instanceof Error ? e.message : e);
    failed.push(name);
  }
}

if (failed.length) {
  console.error(`\nfailed: ${failed.join(", ")}`);
  process.exit(1);
}
console.log("\nevery template passes");
