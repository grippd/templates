// Shared by check.ts and update.ts.
import { $ } from "bun";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const root = join(import.meta.dir, "..");

// The grippd CLI: $GRIPPD if set, else `grippd` on the PATH.
export const grippd = process.env.GRIPPD ?? "grippd";

// Templates with no app code to build: my-product shows a repo's generated files only.
export const buildless = new Set(["my-product"]);

// Every folder with a grippd.yaml, or just the ones named on the command line.
export function templates(args: string[]): string[] {
  const all = readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(root, d.name, "grippd.yaml")))
    .map((d) => d.name)
    .sort();
  const unknown = args.filter((a) => !all.includes(a));
  if (unknown.length) throw new Error(`not a template: ${unknown.join(", ")}`);
  return args.length ? args : all;
}

const START = "<!-- grippd show -->";
const END = "<!-- /grippd show -->";

// The README block that should hold `grippd show`, or null if the README has no markers.
export async function showBlock(dir: string): Promise<{ readme: string; current: string; wanted: string } | null> {
  const path = join(dir, "README.md");
  const readme = existsSync(path) ? await Bun.file(path).text() : "";
  const a = readme.indexOf(START);
  const b = readme.indexOf(END);
  if (a < 0 || b < a) return null;
  const show = (await $`${grippd} show ${dir}`.quiet().text()).trimEnd();
  const wanted = `${START}\n\`\`\`\n$ grippd show\n${show}\n\`\`\`\n${END}`;
  return { readme, current: readme.slice(a, b + END.length), wanted };
}
