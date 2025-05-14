create table users (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  role text check (role in ('Teacher', 'Student')) not null
);

