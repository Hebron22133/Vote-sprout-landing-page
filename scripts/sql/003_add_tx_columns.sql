-- Add onchain metadata
alter table if exists proposals
  add column if not exists creator text,
  add column if not exists tx_hash text;

alter table if exists votes
  add column if not exists tx_hash text;
