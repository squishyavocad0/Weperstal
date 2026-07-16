-- ═══════════════════════════════════════════════════════════════════════
--  De Weperstal — veelgestelde vragen
--  Voer dit bestand één keer uit in de SQL Editor van je Supabase-project
--  (net als schema.sql en storage.sql). Vragen beheer je daarna gewoon
--  op de beheerpagina van de website.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null default '',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.faqs enable row level security;

create policy "publiek leest gepubliceerde vragen"
  on public.faqs for select using (published = true);

create policy "beheer vragen"
  on public.faqs for all to authenticated using (true) with check (true);
