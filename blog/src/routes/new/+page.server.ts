import { error, fail, redirect } from "@sveltejs/kit";
import { env } from "cloudflare:workers";
import { createPost } from "#lib/server/posts.ts";

// The blog is public and has no sign-in, so writing is open only on your own machine.
// Add sign-in (or `access: team` on a separate admin app) before opening it anywhere else.
const local = () => env.ENVIRONMENT === "local";

export const load = () => {
  if (!local()) error(404, "Not found");
};

export const actions = {
  default: async ({ request }) => {
    if (!local()) error(404, "Not found");
    const form = await request.formData();
    const title = String(form.get("title") ?? "").trim();
    const body = String(form.get("body") ?? "").trim();
    const cover = form.get("cover");
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (!slug || !body) return fail(400, { message: "A title and a body are both needed." });
    await createPost({ slug, title, body, cover: cover instanceof File ? cover : undefined });
    redirect(303, `/${slug}`);
  },
};
