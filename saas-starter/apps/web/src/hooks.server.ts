import type { Handle } from "@sveltejs/kit/hooks";
import { env } from "cloudflare:workers";

// `access: team` puts grippd's sign-in in front of this app: nobody reaches it without
// signing in, and the person's email arrives in this header. /healthz stays open so
// grippd Monitor can reach it. Locally there's no sign-in, so you're "you@localhost".
const EMAIL_HEADER = "cf-access-authenticated-user-email";

export const handle: Handle = ({ event, resolve }) => {
  const email = event.request.headers.get(EMAIL_HEADER);
  if (!email && env.ENVIRONMENT !== "local" && event.url.pathname !== "/healthz") {
    return new Response("Sign in first", { status: 401 });
  }
  event.locals.email = email ?? "you@localhost";
  return resolve(event);
};
