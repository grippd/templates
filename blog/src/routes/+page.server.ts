import { listPosts } from "#lib/server/posts.ts";

export const load = async () => ({ posts: await listPosts() });
