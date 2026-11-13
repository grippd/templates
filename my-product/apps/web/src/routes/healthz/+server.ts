// grippd's monitors call this, and Cloudflare Access lets it through.
export const GET = () => new Response("ok");
