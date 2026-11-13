// The bindings grippd generates in wrangler.jsonc, as `env` from "cloudflare:workers"
// sees them. Nothing here is a secret.
declare global {
  namespace Cloudflare {
    interface Env {
      DB: Hyperdrive;
      FILES: R2Bucket;
      ENVIRONMENT: "local" | "staging" | "production";
    }
  }
  namespace App {
    interface Locals {
      email: string;
    }
  }
}

export {};
