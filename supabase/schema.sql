-- ═══════════════════════════════════════════════════════════════════════
--  De Weperstal — databaseschema voor Supabase (PostgreSQL)
--  Voer dit hele bestand één keer uit in de SQL Editor van je
--  Supabase-project. Het maakt alle tabellen, beveiliging en
--  voorbeeldcontent aan.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- ── Tabellen ─────────────────────────────────────────────────────────────

create table if not exists public.animals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  species text not null check (species in ('paard','pony','hond','kat','schaap','kip','vis')),
  age int not null default 0,
  bio text not null default '',
  traits text[] not null default '{}',
  image_url text not null default '',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  intro text not null default '',
  description text not null default '',
  highlights text[] not null default '{}',
  duration text not null default '',
  age_range text not null default '',
  group_size text not null default '',
  price_hint text not null default '',
  image_url text not null default '',
  icon text not null default 'hoof' check (icon in ('hoof','saddle','party','walk')),
  published boolean not null default false,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  body text not null default '',
  cover_url text not null default '',
  gallery text[] not null default '{}',
  author text not null default 'Maria',
  published_at date not null default current_date,
  published boolean not null default false,
  likes int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null default '',
  bio text not null default '',
  image_url text not null default '',
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text not null default 'Contactformulier',
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

-- Logtabel voor likes (analyse / misbruikdetectie); de teller zelf staat
-- op stories.likes en wordt atomisch verhoogd via onderstaande functie.
create table if not exists public.story_likes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- ── Like-functie (atomisch, aan te roepen door bezoekers) ────────────────

create or replace function public.increment_story_likes(story_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.story_likes (story_id) values (story_id);
  update public.stories set likes = likes + 1 where id = story_id;
$$;

grant execute on function public.increment_story_likes(uuid) to anon, authenticated;

-- ── Row Level Security ───────────────────────────────────────────────────
-- Bezoekers (anon): alleen gepubliceerde content lezen + bericht sturen.
-- Ingelogde beheerder (authenticated): alles beheren.

alter table public.animals enable row level security;
alter table public.activities enable row level security;
alter table public.stories enable row level security;
alter table public.team_members enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.story_likes enable row level security;
alter table public.settings enable row level security;

-- Publiek leesbaar (alleen gepubliceerd)
create policy "publiek leest gepubliceerde dieren"
  on public.animals for select using (published = true);
create policy "publiek leest gepubliceerde activiteiten"
  on public.activities for select using (published = true);
create policy "publiek leest gepubliceerde verhalen"
  on public.stories for select using (published = true);
create policy "publiek leest gepubliceerd team"
  on public.team_members for select using (published = true);
create policy "publiek leest siteteksten"
  on public.site_content for select using (true);

-- Publiek mag een bericht sturen
create policy "publiek stuurt bericht"
  on public.contact_messages for insert with check (true);

-- Beheerder mag alles
create policy "beheer dieren" on public.animals
  for all to authenticated using (true) with check (true);
create policy "beheer activiteiten" on public.activities
  for all to authenticated using (true) with check (true);
create policy "beheer verhalen" on public.stories
  for all to authenticated using (true) with check (true);
create policy "beheer team" on public.team_members
  for all to authenticated using (true) with check (true);
create policy "beheer siteteksten" on public.site_content
  for all to authenticated using (true) with check (true);
create policy "beheer berichten" on public.contact_messages
  for all to authenticated using (true) with check (true);
create policy "beheer likes" on public.story_likes
  for select to authenticated using (true);
create policy "beheer instellingen" on public.settings
  for all to authenticated using (true) with check (true);

-- ── Voorbeeldcontent (gelijk aan de ingebouwde demo-content) ─────────────

insert into public.animals (name, species, age, bio, traits, image_url, published, sort_order) values
('Balou','pony',12,'Onze grote vriendelijke reus in ponyformaat. Balou is het kloppend hart van de stal: geduldig, zachtaardig en dol op kinderen die hem borstelen.','{Geduldig,Knuffelbaar,Rustig}','https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1600&q=80',true,1),
('Fjura','paard',9,'Een Noorse fjord met een manenkam om jaloers op te zijn. Fjura loopt graag voorop tijdens buitenritten en vindt wortels het mooiste dat bestaat.','{Nieuwsgierig,Betrouwbaar,Buitenmens}','https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=80',true,2),
('Muis','pony',17,'Klein maar wijs. Muis heeft al honderden kinderen hun eerste rondje laten rijden en weet precies wanneer iemand een beetje extra rust nodig heeft.','{Wijs,Zachtaardig,Eerste-keer-expert}','https://images.unsplash.com/photo-1595179920064-56d95e1c8db8?auto=format&fit=crop&w=1600&q=80',true,3),
('Storm','paard',6,'De jongste van de kudde, vol energie en levenslust. Storm leert nog elke dag bij — net als de kinderen — en is gek op spelletjes in de wei.','{Speels,Energiek,Leergierig}','https://images.unsplash.com/photo-1534773728080-33d31da27ae5?auto=format&fit=crop&w=1600&q=80',true,4),
('Wolkje','pony',14,'Zo wit en zacht als haar naam belooft. Wolkje is de favoriet bij kinderfeestjes en laat zich eindeloos vlechten en versieren.','{Fotogeniek,Lief,Feestbeest}','https://images.unsplash.com/photo-1553284966-19b8815c7817?auto=format&fit=crop&w=1600&q=80',true,5),
('Kees','hond',5,'Onze border collie en officieuze stalmanager. Kees begroet ieder kind bij het hek en houdt vanaf zijn strobaal toezicht op alles.','{Trouw,Slim,"Overal bij"}','https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=1600&q=80',true,6),
('Poes Praline','kat',8,'Praline woont in het zadelhok en beschouwt iedere schoot als haar eigendom. Wie stil op een hooibaal zit, krijgt vanzelf bezoek.','{Eigenwijs,Aanhankelijk,Zonaanbidder}','https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1600&q=80',true,7),
('Berend','schaap',4,'Berend en zijn kleine kudde houden het gras kort en de sfeer gemoedelijk. In het voorjaar mogen kinderen helpen bij het lammetjes kijken.','{Gemoedelijk,Wollig,Grasexpert}','https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=1600&q=80',true,8),
('De Dametjes','kip',2,'Zes scharrelkippen die elke ochtend verse eieren leggen. Eieren rapen is bij ons een echt klusje voor de jongste bezoekers.','{Druk,Nieuwsgierig,"Vroege vogels"}','https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1600&q=80',true,9),
('Goudvinnen','vis',3,'In de oude drinkbak bij de boomgaard zwemmen onze goudvissen rustig hun rondjes. Het stilste plekje van het erf.','{Kalm,Glinsterend,Zen}','https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1600&q=80',true,10);

insert into public.activities (slug, title, intro, description, highlights, duration, age_range, group_size, price_hint, image_url, icon, published, sort_order, seo_title, seo_description) values
('balou-basis','Balou Basis',
 'Dé eerste kennismaking met pony''s: borstelen, verzorgen, leiden en een eerste rondje rijden — helemaal op het tempo van je kind.',
 E'Balou Basis is onze instapactiviteit voor kinderen die nog nooit (of bijna nooit) met pony''s hebben gewerkt. In kleine groepjes van maximaal vier kinderen leren ze stap voor stap hoe je een pony benadert, borstelt, opzadelt en leidt.\n\nWe beginnen altijd op de grond. Vertrouwen komt eerst, rijden komt later. Kinderen ontdekken hoe een pony denkt, wat zijn oren vertellen en waarom rust en duidelijkheid zo belangrijk zijn. Pas als een kind er klaar voor is, maken we samen een eerste rondje aan de hand.\n\nIedere les sluiten we af met een verzorgmoment en iets lekkers voor pony én kind. Zo wordt elke week een klein feestje om naar uit te kijken.',
 '{"Kleine groepjes van maximaal 4 kinderen","Eerst vertrouwen op de grond, dan pas rijden","Alle veiligheidscaps en materialen aanwezig","Wekelijks vast moment met vaste begeleiding"}',
 '60 minuten','4 – 8 jaar','max. 4 kinderen','vanaf € 17,50 per les',
 'https://images.unsplash.com/photo-1594768816441-1dd241ffaa67?auto=format&fit=crop&w=1600&q=80','hoof',true,1,
 'Balou Basis – eerste kennismaking met pony''s | De Weperstal',
 'Balou Basis is de veilige eerste kennismaking met pony''s voor kinderen van 4 tot 8 jaar. Kleine groepjes, veel aandacht en plezier bij De Weperstal in Oosterwolde.'),
('iets-meer-paardrijden','Iets Meer Paardrijden',
 'Voor kinderen die de basis kennen en meer willen: zelfstandiger rijden, buitenritjes en spelenderwijs werken aan houding en balans.',
 E'Heeft je kind de eerste stappen gezet en glinsteren de ogen bij alles wat met paarden te maken heeft? Bij Iets Meer Paardrijden bouwen we rustig verder aan zelfstandigheid in het zadel.\n\nWe werken aan balans, houding en communicatie met de pony — altijd spelenderwijs, nooit met prestatiedruk. Denk aan behendigheidsparcoursjes, spelletjes te paard en bij mooi weer korte buitenritjes door het coulisselandschap rond Oosterwolde.\n\nOok hier blijft verzorging een vast onderdeel: kinderen leren dat rijden begint en eindigt bij goed zorgen voor je dier.',
 '{"Zelfstandiger rijden in eigen tempo","Buitenritjes door het Friese coulisselandschap","Spelvormen in plaats van prestatiedruk","Aandacht voor houding, balans en dierwelzijn"}',
 '75 minuten','7 – 13 jaar','max. 5 kinderen','vanaf € 21,00 per les',
 'https://images.unsplash.com/photo-1450052590821-8bf91254a353?auto=format&fit=crop&w=1600&q=80','saddle',true,2,
 'Iets Meer Paardrijden – doorgroeien in het zadel | De Weperstal',
 'Voor kinderen van 7 tot 13 jaar die verder willen groeien: zelfstandig rijden, buitenritjes en spelvormen bij De Weperstal in Oosterwolde.'),
('kinderfeestjes','Kinderfeestjes',
 'Een verjaardag tussen de pony''s: versieren, vlechten, ritjes maken en limonade in de boomgaard. Een feestje dat kinderen nooit vergeten.',
 E'Een kinderfeestje bij De Weperstal is twee uur lang genieten. De jarige en vriendjes worden ontvangen met slingers in de stal en een pony die speciaal voor het feest is ''aangekleed''.\n\nHet programma stellen we samen met de jarige samen: pony''s borstelen en vlechten, een speurtocht over het erf, ritjes op Wolkje of Balou en natuurlijk gezamenlijk taart en limonade aan de lange tafel in de boomgaard.\n\nWij zorgen voor alles — begeleiding, materialen, versiering en wat lekkers. Ouders hoeven alleen maar te genieten (en foto''s te maken).',
 '{"2 uur volledig verzorgd feestprogramma","Pony versieren, vlechten en ritjes maken","Speurtocht over het erf","Taartmoment aan de lange tafel in de boomgaard"}',
 '120 minuten','5 – 12 jaar','max. 8 kinderen','vanaf € 15,00 per kind',
 'https://images.unsplash.com/photo-1602166242292-93a00e63e8e8?auto=format&fit=crop&w=1600&q=80','party',true,3,
 'Kinderfeestje tussen de pony''s | De Weperstal Oosterwolde',
 'Vier een onvergetelijk kinderfeestje bij De Weperstal: pony''s versieren, ritjes maken en taart in de boomgaard. Volledig verzorgd in Oosterwolde.'),
('wandelen-met-pony','Wandelen met Pony',
 'Samen met je (klein)kind en een pony aan de hand wandelen door bos en veld. Rust, natuur en quality time in één.',
 E'Soms hoeft het niet groots. Bij Wandelen met Pony krijg je samen met je kind een pony mee voor een begeleide wandeling door de bossen en zandpaden rond Oosterwolde.\n\nKinderen mogen om de beurt leiden of een stukje op de ponyrug zitten, terwijl jij ernaast loopt. Onderweg vertellen we over de natuur, de dieren en alles wat we tegenkomen. Halverwege is er een picknickmoment op een mooie plek.\n\nDeze wandelingen zijn ook heel geschikt voor opa''s en oma''s die iets bijzonders met hun kleinkind willen doen, of voor gezinnen die even samen willen onthaasten.',
 '{"Begeleide wandeling van ± 5 km door bos en veld","Kinderen leiden zelf of rijden een stukje","Picknickmoment onderweg inbegrepen","Ook leuk als uitje met opa en oma"}',
 '150 minuten','alle leeftijden','max. 3 gezinnen','vanaf € 27,50 per pony',
 'https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=1600&q=80','walk',true,4,
 'Wandelen met een pony door bos en veld | De Weperstal',
 'Wandel samen met je kind en een pony aan de hand door de natuur rond Oosterwolde. Inclusief picknick. Een uitje vol rust en verbinding.');

insert into public.stories (slug, title, excerpt, body, cover_url, gallery, author, published_at, published, likes) values
('eerste-lammetjes-van-het-voorjaar','De eerste lammetjes van het voorjaar',
 'Berend kijkt er trots bij: er lopen weer wollige wolkjes door de wei. En de kinderen van de woensdaggroep waren er als eersten bij.',
 E'Het is elk jaar weer een klein wonder. Op een vroege dinsdagochtend, nog voor de eerste kinderen kwamen, stonden er ineens twee wankele lammetjes naast hun moeder in de wei.\n\nDe kinderen van de woensdaggroep mochten als eersten kijken — op gepaste afstand, muisstil, precies zoals we dat samen geoefend hadden. Je hoorde alleen het gras en af en toe een onderdrukt "ooooh".\n\nWat mij elke keer weer raakt: hoe vanzelfsprekend kinderen begrijpen dat je rustig moet zijn bij jonge dieren. Niemand hoefde het te zeggen. Ze voelden het gewoon.\n\nDe komende weken mogen de vaste groepen om de beurt helpen bij het voeren. En ja, de lammetjes hebben inmiddels namen: Wolkje Junior en Drop. Democratisch gekozen door de kinderen, met overweldigende meerderheid.',
 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=1600&q=80',
 '{"https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80"}',
 'Maria','2026-03-28',true,47),
('sara-en-muis','Hoe Sara en Muis elkaar vonden',
 'Sara durfde eerst niet eens de stal in. Drie maanden later leidt ze Muis zelfstandig naar de wei. Dit is haar verhaal.',
 E'Toen Sara (6) hier in het najaar voor het eerst kwam, bleef ze bij het hek staan. De stal in? Echt niet. Pony''s waren groot, en groot was spannend.\n\nWe hebben niets geforceerd. Sara mocht kijken, wortels aangeven over het hek, en verder helemaal niets. Week twee: één stap de stal in. Week vier: Muis borstelen, met mama ernaast. Week zes: Muis borstelen, zonder mama.\n\nAfgelopen woensdag zag ik Sara met het halstertouw in haar hand door het gras lopen, Muis rustig achter haar aan. Ze keek niet eens om — ze wíst dat Muis meeliep. Dat soort vertrouwen kun je niet uitleggen, dat moet je verdienen. En Sara heeft het verdiend.\n\nHaar moeder stond bij het hek te kijken. Ik geloof dat we allebei iets in ons oog hadden.',
 'https://images.unsplash.com/photo-1594768816441-1dd241ffaa67?auto=format&fit=crop&w=1600&q=80',
 '{"https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1200&q=80"}',
 'Maria','2026-03-14',true,82),
('modderdag','Modderdag (of: waarom laarzen bestaan)',
 'Na een week regen was de wei één grote modderpoel. Wij zagen een probleem, de kinderen zagen het beste speelterrein ooit.',
 E'Er zijn dagen waarop je planning het aflegt tegen het weer. Vorige week was zo''n week: zeven dagen regen, en de paddock veranderde in iets wat het midden hield tussen een wei en chocolademousse.\n\nPlan A (buitenritje) kon niet doorgaan. Plan B werd geboren door de kinderen zelf: laarzenrace, modderkastelen bouwen, en Kees de hond die besloot dat hij vandaag officieel een bruine hond was.\n\nDe pony''s stonden er vanuit de droge stal hoofdschuddend naar te kijken. Balou kreeg naderhand het beste borstelmoment van zijn leven, want ook hij had natuurlijk stiekem in de modder gestaan.\n\nAan alle ouders die die middag kinderen ophaalden die eruitzagen alsof ze door een veenmoeras waren gekropen: het spijt ons niets. Kijk naar die koppies.',
 'https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=1600&q=80',
 '{"https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=1200&q=80","https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=1200&q=80"}',
 'Maria','2026-02-20',true,63),
('winterochtend-in-de-stal','Een winterochtend in de stal',
 'Bevroren adem, warme paardenlijven en dampende thee. Waarom de winter stiekem het mooiste seizoen op stal is.',
 E'Iedereen denkt bij een ponystal aan de zomer. Maar wie hier op een vrieskoude zaterdagochtend komt, ontdekt een geheim: de winter is misschien wel het mooiste seizoen.\n\nDe stal is dan een warme, dampende wereld van hooi en paardenadem. Kinderen komen binnen met rode wangen en verdwijnen tussen de dieren, waar het altijd een paar graden warmer is. Fjura''s wintervacht is zo dik dat je vingers erin verdwijnen.\n\nOp zulke ochtenden doen we alles rustiger. Extra lang borstelen. Warme thee aan de staltafel. En als het gevroren heeft, kraakt de wei onder de hoeven tijdens een korte wandeling.\n\nDe winter leert kinderen iets belangrijks: dieren hebben je elke dag nodig, niet alleen als de zon schijnt. En gek genoeg zijn juist die koude ochtenden de momenten die ze zich later herinneren.',
 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1600&q=80',
 '{"https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80"}',
 'Maria','2026-01-17',true,51),
('waarom-we-klein-blijven','Waarom De Weperstal klein blijft',
 'We krijgen vaak de vraag of we niet willen uitbreiden. Het antwoord is nee — en dat is een heel bewuste keuze.',
 E'Met enige regelmaat krijg ik de vraag: "Waarom nemen jullie niet meer kinderen aan? Waarom geen tweede rijbak, meer pony''s, langere openingstijden?"\n\nHet eerlijke antwoord: omdat klein precies de bedoeling is.\n\nIk ken ieder kind dat hier komt bij naam. Ik weet wie er een moeilijke week heeft gehad, wie er eindelijk durft te draven en wie er stiekem het liefst alleen maar knuffelt met Praline in het zadelhok. Dat kan alleen omdat we klein zijn.\n\nOok voor de dieren is dit belangrijk. Onze pony''s werken korte dagen, staan veel in de wei en hebben net zo goed recht op vrije tijd als wij. Een pony die met plezier werkt, is een veilige pony — en dat voelen kinderen feilloos aan.\n\nDus nee, we worden niet groter. We worden hooguit elk jaar een beetje beter in wat we doen.',
 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80',
 '{}','Maria','2025-12-05',true,96);

insert into public.team_members (name, role, bio, image_url, published, sort_order) values
('Maria','Oprichter & hoofdbegeleider','Maria groeide zelf op tussen de paarden en droomde als kind al van een eigen plek waar dieren en kinderen samen kunnen groeien. Sinds de oprichting van De Weperstal begeleidt ze iedere groep persoonlijk. Haar motto: eerst vertrouwen, dan pas rijden.','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',true,1),
('Jelte','Stalhulp & buitenritbegeleider','Jelte kent elk zandpad rond Oosterwolde en loopt mee tijdens de ponywandelingen en buitenritten. Handig met hoeven, hekken en het kalmeren van zenuwachtige ouders.','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',true,2),
('Femke','Begeleider kinderfeestjes','Femke tovert de stal om voor ieder feestje en verzint speurtochten waar kinderen weken later nog over praten. Studeert pedagogiek en is elke zaterdag op stal te vinden.','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',true,3);

insert into public.site_content (key, value) values
('hero_title','Welkom bij De Weperstal'),
('hero_subtitle','Een plek waar kinderen dromen beleven tussen de paarden en pony''s.'),
('hero_tagline','Laat je kind genieten van plezier, natuur en avontuur.'),
('intro_title','Opgroeien tussen dieren en natuur'),
('intro_text','De Weperstal is geen gewone manege. Het is een kleinschalig erf aan de rand van Oosterwolde waar kinderen op hun eigen tempo leren omgaan met paarden, pony''s en al het andere leven op de boerderij. Geen prestatiedruk, wel modder aan je laarzen, wind in je haren en dieren die je leren wie je bent.'),
('about_lead','Waarom De Weperstal bestaat? Omdat ieder kind een plek verdient waar het gewoon kind mag zijn — tussen dieren die niet oordelen en natuur die alle tijd heeft.'),
('cta_title','Kom eens langs'),
('cta_text','De beste manier om De Weperstal te leren kennen is door het zelf te voelen. Plan een vrijblijvende kennismaking en ontdek of dit de plek is voor jouw kind.'),
('contact_intro','Vragen, een kennismaking plannen of een feestje aanvragen? Stuur ons een bericht — we antwoorden meestal binnen één werkdag.')
on conflict (key) do nothing;

insert into public.settings (key, value) values
('site_name','De Weperstal'),
('contact_email','hallo@weperstal.nl')
on conflict (key) do nothing;
