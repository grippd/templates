// A stand-in for @grippd/sdk, which isn't on npm yet. It has the two exports this app
// uses, `db` (Drizzle) and `files`, built straight on the bindings grippd generates in
// wrangler.jsonc. The real package adds every cache layer on top. vite.config.ts says how
// to switch to it.
import { env } from "cloudflare:workers";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Partial: an app only gets the bindings for what it uses.
const bindings = env as Partial<Pick<Cloudflare.Env, "DB" | "FILES">>;

function binding<T>(value: T | undefined, name: string): T {
  if (!value) throw new Error(`No ${name} binding: run the app with \`grippd dev\`.`);
  return value;
}

// A fresh client for each query: Workers can't share sockets between requests, and the
// database's pooler sits in front, so connecting is cheap. It closes once idle, which
// matters only under the dev server, where nothing ends the request's sockets.
export const db = new Proxy({} as PostgresJsDatabase, {
  get(_, prop) {
    const client = postgres(binding(bindings.DB, "DB").connectionString, {
      max: 1,
      fetch_types: false,
      idle_timeout: 1,
    });
    const d = drizzle(client);
    const value = Reflect.get(d, prop, d);
    return typeof value === "function" ? value.bind(d) : value;
  },
});

export const files = {
  put: (path: string, body: ArrayBuffer | ReadableStream | string, contentType?: string) =>
    binding(bindings.FILES, "FILES").put(path, body, contentType ? { httpMetadata: { contentType } } : undefined),
  get: (path: string) => binding(bindings.FILES, "FILES").get(path),
  delete: (path: string) => binding(bindings.FILES, "FILES").delete(path),
};
