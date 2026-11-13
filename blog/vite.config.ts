import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit({ adapter: adapter() })],
  resolve: {
    alias: {
      // @grippd/sdk isn't on npm yet: point the import at a small stand-in. Once it is,
      // delete this, src/lib/grippd-sdk.ts and src/grippd-sdk.d.ts, then `bun add @grippd/sdk`.
      "@grippd/sdk": "/src/lib/grippd-sdk.ts",
    },
  },
});
