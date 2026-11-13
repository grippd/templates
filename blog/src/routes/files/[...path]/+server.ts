import { error } from "@sveltejs/kit";
import { getFile } from "#lib/server/posts.ts";

// Serves uploads from grippd Storage. Only covers are public.
export const GET = async ({ params }) => {
  if (!params.path.startsWith("covers/")) error(404, "Not found");
  const file = await getFile(params.path);
  if (!file) error(404, "Not found");
  return new Response(file.body, {
    headers: {
      "content-type": file.httpMetadata?.contentType ?? "application/octet-stream",
      etag: file.httpEtag,
      "cache-control": "public, max-age=3600",
    },
  });
};
