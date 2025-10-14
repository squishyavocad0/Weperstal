-- Corrected Supabase SQL (run in Supabase SQL editor)

-- Animals table
create table if not exists animals (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text not null,
  "desc" text,
  image_url text,
  created_at timestamp with time zone default now()
);

-- Posts table  
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  story text,
  image text,
  visible boolean default true,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table animals enable row level security;
alter table posts enable row level security;

-- Public read policies
create policy "public read animals" on animals for select using (true);
create policy "public read posts" on posts for select using (true);

-- Admin write policies (authenticated users)
create policy "auth write animals" on animals for all
  to authenticated using (true) with check (true);

create policy "auth write posts" on posts for all
  to authenticated using (true) with check (true);
