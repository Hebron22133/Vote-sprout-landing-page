insert into daos (name, description) values
('VoteSprout Core', 'Core governance DAO'),
('Community Grants', 'Grants and funding for ecosystem') 
on conflict do nothing;

insert into proposals (dao_id, title, description, options) values
(1, 'Adopt Gasless Voting Standard', 'Adopt gasless voting across all products.', '["For","Against","Abstain]'),
(2, 'Q4 Grants Round', 'Fund 10 builder teams this quarter.', '["Approve","Reject"]')
on conflict do nothing;
