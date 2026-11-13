import { error } from "@sveltejs/kit";
import { getFile } from "#lib/server/projects.ts";

// Behind the same team-only sign-in as every other route.
export const GET = async ({ params }) => {
  if (!params.path.startsWith("projects/")) error(404, "Not found");
  const file = await getFile(params.path);
  if (!file) error(404, "Not found");
  return new Response(file.body, {
    headers: {
      "content-type": file.httpMetadata?.contentType ?? "application/octet-stream",
      etag: file.httpEtag,
      "cache-control": "private, max-age=300",
    },
  });
};
