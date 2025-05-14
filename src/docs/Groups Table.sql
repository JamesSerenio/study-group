create table groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_by uuid references users(id) on delete cascade,
  created_at timestamp default now()
);
