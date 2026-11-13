create table items (
  id uuid primary key default gen_random_uuid(),
  team_id text not null,
  name text not null,
  archived_at timestamp
);
