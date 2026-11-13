import { db } from "@grippd/sdk";

// No connection string, key or cache code: grippd delivers the credentials and
// serves the read from the nearest fresh cache layer.
export const listItems = (teamId: string) =>
  db`select id, name from items where team_id = ${teamId} order by name`;
