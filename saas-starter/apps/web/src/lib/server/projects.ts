import { db, files } from "@grippd/sdk";
import { projects } from "@saas-starter/db";
import { and, desc, eq, isNull } from "drizzle-orm";

// No connection string, key or cache code: grippd delivers the credentials.
export const listProjects = () =>
  db.select().from(projects).where(isNull(projects.archivedAt)).orderBy(desc(projects.createdAt));

export async function createProject(name: string, createdBy: string, attachment?: File) {
  const [project] = await db.insert(projects).values({ name, createdBy }).returning({ id: projects.id });
  if (project && attachment && attachment.size > 0) {
    const path = `projects/${project.id}/${attachment.name.replace(/[^\w.-]+/g, "_")}`;
    await files.put(path, await attachment.arrayBuffer(), attachment.type);
    await db.update(projects).set({ attachment: path }).where(eq(projects.id, project.id));
  }
}

// Archived projects are deleted, with their files, by the worker after 30 days.
export const archiveProject = (id: string) =>
  db.update(projects).set({ archivedAt: new Date() }).where(and(eq(projects.id, id), isNull(projects.archivedAt)));

export const getFile = (path: string) => files.get(path);
