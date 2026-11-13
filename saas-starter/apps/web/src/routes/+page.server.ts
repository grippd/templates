import { fail } from "@sveltejs/kit";
import { archiveProject, createProject, listProjects } from "#lib/server/projects.ts";

export const load = async ({ locals }) => ({ email: locals.email, projects: await listProjects() });

export const actions = {
  create: async ({ request, locals }) => {
    const form = await request.formData();
    const name = String(form.get("name") ?? "").trim();
    const attachment = form.get("attachment");
    if (!name) return fail(400, { message: "Give the project a name." });
    await createProject(name, locals.email, attachment instanceof File ? attachment : undefined);
  },
  archive: async ({ request }) => {
    const id = String((await request.formData()).get("id") ?? "");
    if (id) await archiveProject(id);
  },
};
