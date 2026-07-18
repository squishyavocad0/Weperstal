-- ═══════════════════════════════════════════════════════════════════════
--  De Weperstal — beheerrollen
--  Voer dit bestand één keer uit in de SQL Editor van je Supabase-project.
--
--  Twee rollen:
--   · beheerder — mag alles (Maria, Koen)
--   · stalhulp  — mag alleen dieren en verhalen beheren (en foto's
--                 uploaden); de rest van de site is afgeschermd
--
--  Bestaande accounts worden automatisch beheerder. Nieuwe accounts
--  zijn standaard stalhulp; promoveren kan daarna gewoon op de
--  pagina "Gebruikers" in het beheer van de website.
-- ═══════════════════════════════════════════════════════════════════════

create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  role text not null default 'stalhulp' check (role in ('beheerder','stalhulp')),
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

-- Helper: is de ingelogde gebruiker een beheerder?
-- (security definer zodat de check niet in RLS-lussen loopt)
create or replace function public.is_beheerder()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_roles
    where user_id = auth.uid() and role = 'beheerder'
  );
$$;

grant execute on function public.is_beheerder() to authenticated;

-- Iedereen ziet de eigen rol; beheerders zien en beheren alle rollen.
drop policy if exists "eigen rol lezen" on public.admin_roles;
create policy "eigen rol lezen" on public.admin_roles
  for select to authenticated
  using (user_id = auth.uid() or public.is_beheerder());

drop policy if exists "beheerder beheert rollen" on public.admin_roles;
create policy "beheerder beheert rollen" on public.admin_roles
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());

-- Alle bestaande accounts worden beheerder (er verandert dus niets
-- voor wie nu al toegang heeft).
insert into public.admin_roles (user_id, email, role)
select id, coalesce(email, ''), 'beheerder' from auth.users
on conflict (user_id) do nothing;

-- ── Gebruikersoverzicht en rolbeheer (alleen voor beheerders) ────────────

create or replace function public.admin_users_overzicht()
returns table (user_id uuid, email text, role text)
language sql stable security definer
set search_path = public
as $$
  select u.id, coalesce(u.email, '')::text, coalesce(r.role, 'stalhulp')::text
  from auth.users u
  left join public.admin_roles r on r.user_id = u.id
  where public.is_beheerder()
  order by u.email;
$$;

revoke all on function public.admin_users_overzicht() from public, anon;
grant execute on function public.admin_users_overzicht() to authenticated;

create or replace function public.zet_rol(doel_user uuid, nieuwe_rol text)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if not public.is_beheerder() then
    raise exception 'Alleen beheerders mogen rollen wijzigen';
  end if;
  if nieuwe_rol not in ('beheerder', 'stalhulp') then
    raise exception 'Onbekende rol: %', nieuwe_rol;
  end if;
  insert into public.admin_roles (user_id, email, role)
  values (
    doel_user,
    coalesce((select email from auth.users where id = doel_user), ''),
    nieuwe_rol
  )
  on conflict (user_id) do update set role = excluded.role;
end;
$$;

revoke all on function public.zet_rol(uuid, text) from public, anon;
grant execute on function public.zet_rol(uuid, text) to authenticated;

-- ── Rechten aanscherpen ──────────────────────────────────────────────────
-- Dieren en verhalen blijven voor iedere ingelogde gebruiker beheerbaar
-- (dus ook stalhulpen). De rest wordt alleen-beheerder.

drop policy if exists "beheer activiteiten" on public.activities;
create policy "beheer activiteiten" on public.activities
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());

drop policy if exists "beheer team" on public.team_members;
create policy "beheer team" on public.team_members
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());

drop policy if exists "beheer siteteksten" on public.site_content;
create policy "beheer siteteksten" on public.site_content
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());

drop policy if exists "beheer berichten" on public.contact_messages;
create policy "beheer berichten" on public.contact_messages
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());

drop policy if exists "beheer instellingen" on public.settings;
create policy "beheer instellingen" on public.settings
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());

drop policy if exists "beheer likes" on public.story_likes;
create policy "beheer likes" on public.story_likes
  for select to authenticated
  using (public.is_beheerder());

drop policy if exists "beheer vragen" on public.faqs;
create policy "beheer vragen" on public.faqs
  for all to authenticated
  using (public.is_beheerder()) with check (public.is_beheerder());
