import { db, files } from "@grippd/sdk";
import { desc, eq } from "drizzle-orm";
import { posts } from "./schema.ts";

// No connection string, key or cache code: grippd delivers the credentials.
export const listPosts = () =>
  db.select({ slug: posts.slug, title: posts.title, publishedAt: posts.publishedAt })
    .from(posts)
    .orderBy(desc(posts.publishedAt));

export const getPost = async (slug: string) =>
  (await db.select().from(posts).where(eq(posts.slug, slug)).limit(1))[0];

export const createPost = async (post: { slug: string; title: string; body: string; cover?: File }) => {
  let cover: string | null = null;
  if (post.cover && post.cover.size > 0) {
    cover = `covers/${post.slug}`;
    await files.put(cover, await post.cover.arrayBuffer(), post.cover.type);
  }
  await db.insert(posts).values({ slug: post.slug, title: post.title, body: post.body, cover });
};

export const getFile = (path: string) => files.get(path);
