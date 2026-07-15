-- ═══════════════════════════════════════════════════════════════════════
--  De Weperstal — foto-opslag (Supabase Storage)
--  Voer dit bestand één keer uit in de SQL Editor van je Supabase-project
--  (net als schema.sql). Het maakt de publieke 'media'-bucket aan waar
--  het beheer foto's naartoe uploadt.
-- ═══════════════════════════════════════════════════════════════════════

-- Bucket: publiek leesbaar, alleen afbeeldingen, max 15 MB per bestand.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 15728640, '{image/*}')
on conflict (id) do nothing;

-- Iedereen mag foto's bekijken (nodig om ze op de site te tonen).
create policy "publiek leest media"
  on storage.objects for select
  using (bucket_id = 'media');

-- Alleen de ingelogde beheerder mag uploaden, wijzigen en verwijderen.
create policy "beheerder uploadt media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media');

create policy "beheerder wijzigt media"
  on storage.objects for update to authenticated
  using (bucket_id = 'media');

create policy "beheerder verwijdert media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media');
