-- Correct seed values (safe to run multiple times)
-- Fix malformed JSON in previous seed and ensure proposals exist.
insert into daos (name, description)
values ('VoteSprout Core', 'Core governance DAO'),
       ('Community Grants', 'Grants and funding for ecosystem')
on conflict do nothing;

-- Ensure a baseline proposal exists for DAO 1
insert into proposals (dao_id, title, description, options)
values
  (1, 'Adopt Gasless Voting Standard', 'Adopt gasless voting across all products.', '["For","Against","Abstain"]'::jsonb)
on conflict do nothing;
