-- ═══════════════════════════════════════════════════════════════════════
--  De Weperstal — eigen pagina per dier
--  Voer dit bestand één keer uit in de SQL Editor van je Supabase-project.
--
--  Voegt aan de dieren toe:
--   · slug    — de link van de eigen pagina (/dieren/balou)
--   · story   — het volledige verhaal (de bio blijft de korte kaarttekst)
--   · gallery — extra foto's voor op de eigen pagina
--
--  Bestaande dieren krijgen automatisch een slug op basis van hun naam.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.animals add column if not exists slug text not null default '';
alter table public.animals add column if not exists story text not null default '';
alter table public.animals add column if not exists gallery text[] not null default '{}';

-- Slugs afleiden uit de naam ("Poes Praline" → "poes-praline")
update public.animals
set slug = trim(both '-' from regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
where slug = '';

-- Mochten twee dieren dezelfde naam hebben: maak de slug uniek
update public.animals a
set slug = a.slug || '-' || left(a.id::text, 4)
where exists (
  select 1 from public.animals b
  where b.slug = a.slug and b.id < a.id
);

-- Uniek zolang gevuld; leeg (= geen eigen pagina) mag vaker voorkomen
create unique index if not exists animals_slug_key
  on public.animals (slug) where slug <> '';
