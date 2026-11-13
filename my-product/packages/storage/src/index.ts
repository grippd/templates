import { files } from "@grippd/sdk";

// The bucket and its key come from grippd; each app gets its own key.
export const putUpload = (path: string, body: ReadableStream) => files.put(path, body);
