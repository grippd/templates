import { error } from "@sveltejs/kit";
import { getPost } from "#lib/server/posts.ts";

export const load = async ({ params }) => {
  const post = await getPost(params.slug);
  if (!post) error(404, "No such post");
  return { post };
};
