-- Neon schema for VoteSprout
create table if not exists daos (
  id serial primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists proposals (
  id serial primary key,
  dao_id integer not null references daos(id) on delete cascade,
  title text not null,
  description text,
  options jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id serial primary key,
  proposal_id integer not null references proposals(id) on delete cascade,
  voter text not null,
  choice_index integer not null,
  created_at timestamptz not null default now(),
  constraint unique_vote unique (proposal_id, voter)
);
