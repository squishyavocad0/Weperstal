# De Weperstal — weperstal.nl

Een premium, productieklare website voor De Weperstal: een kleinschalige plek
bij Oosterwolde waar kinderen opgroeien tussen paarden, pony's en natuur.

Gebouwd met **Next.js 14 (App Router) · TypeScript · TailwindCSS · Supabase (PostgreSQL)**.

---

## Snel starten (zonder database)

De site heeft ingebouwde voorbeeldcontent en werkt direct, ook zonder Supabase:

```bash
npm install
npm run dev
```

Open http://localhost:3000 — alle pagina's zijn meteen compleet gevuld
(dieren, verhalen, activiteiten, team en teksten). Het contactformulier en de
like-knoppen werken in demomodus; er wordt dan alleen niets opgeslagen.

## Database & beheer activeren (Supabase)

1. **Maak een gratis project** op https://supabase.com.
2. Open in het Supabase-dashboard de **SQL Editor**, plak de volledige inhoud
   van `supabase/schema.sql` en voer die één keer uit. Dit maakt alle
   tabellen, beveiliging (Row Level Security) én de voorbeeldcontent aan.
3. Kopieer `.env.example` naar `.env.local` en vul in (te vinden onder
   *Project Settings → API*):

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

4. **Maak een beheerdersaccount voor Maria**: Supabase-dashboard →
   *Authentication → Users → Add user* → e-mailadres + wachtwoord
   (vink "auto confirm" aan).
5. Herstart `npm run dev` en log in op **/admin**.

### Wat kan Maria in het beheer?

- **Dieren, Verhalen, Activiteiten, Team**: toevoegen, bewerken, verwijderen
- **Publiceren/verbergen**: alles wat verborgen is, blijft bewaard als concept
- **Volgorde wijzigen**: kaarten verslepen (drag-and-drop)
- **Teksten**: homepage- en paginateksten aanpassen, met uitleg per veld
- **SEO**: per verhaal en activiteit een eigen Google-titel en -omschrijving
- **Berichten**: contactformulier-inzendingen lezen en afhandelen

Nieuwe items starten bewust als *concept*, zodat er nooit per ongeluk iets
half-afs op de site komt. De vormgeving zelf is niet aanpasbaar vanuit het
beheer — zo kan de stijl niet kapot.

## Eigen foto's gebruiken

Upload foto's naar **Supabase Storage** (maak een publieke bucket, bv.
`fotos`), kopieer de publieke link en plak die in het fotoveld in het beheer.
Links van `images.unsplash.com` en `*.supabase.co` worden automatisch
geoptimaliseerd door Next.js (zie `next.config.mjs`; voeg daar zo nodig een
extra domein toe).

## Productie & deployment

```bash
npm run build
npm start
```

Aanbevolen: deployen op **Vercel** — repository importeren, de twee
environment-variabelen toevoegen, klaar. Sitemap (`/sitemap.xml`) en robots
(`/robots.txt`) worden automatisch gegenereerd; `/admin` en `/api` zijn
uitgesloten van indexering.

## Structuur

```
app/(site)/        Publieke pagina's (home, over ons, activiteiten, dieren, verhalen, contact)
app/admin/         Beveiligde beheeromgeving (login + dashboard)
app/api/           Contactformulier- en like-endpoints
components/site/   Header, footer, hero, kaarten, animaties (gras, stof, bladeren)
components/admin/  Generieke beheercomponent (CRUD, slepen, publiceren)
lib/               Datalaag (Supabase + ingebouwde voorbeeldcontent), types, seed
supabase/          schema.sql — tabellen, RLS-policies, like-functie, seed-data
middleware.ts      Beveiliging van /admin via Supabase-sessies
```

## Technische keuzes

- **Server Components** voor alle publieke pagina's; client components alleen
  waar interactie nodig is (filters, slider, formulieren, animaties).
- **Geen extra dependencies**: confetti, stofdeeltjes en scroll-animaties zijn
  zelf gebouwd (canvas + IntersectionObserver) — snel en licht.
- **Toegankelijk**: skiplink, focusstijlen, aria-labels, `aria-live` bij het
  filteren, en alle animaties respecteren `prefers-reduced-motion`.
- **Veilig**: Row Level Security in PostgreSQL — bezoekers zien alleen
  gepubliceerde content; alleen ingelogde beheerders kunnen wijzigen.
- **Privacy**: geen exact adres op de site; de kaart toont alleen de omgeving
  van Oosterwolde.
