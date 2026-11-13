// Regenerates every template's generated files and the `grippd show` block in its README.
//   bun scripts/update.ts [template...]
import { $ } from "bun";
import { join } from "node:path";
import { grippd, root, showBlock, templates } from "./lib";

for (const name of templates(process.argv.slice(2))) {
  const dir = join(root, name);
  await $`${grippd} build ${dir}`;
  const block = await showBlock(dir);
  if (block && block.current !== block.wanted) {
    await Bun.write(join(dir, "README.md"), block.readme.replace(block.current, block.wanted));
    console.log(`${name}: README updated`);
  }
}
