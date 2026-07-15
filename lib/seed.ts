import type { Activity, Animal, Story, TeamMember } from "./types";

// ── Voorbeeldcontent ────────────────────────────────────────────────────────
// Deze content wordt gebruikt zolang Supabase niet is gekoppeld, en dient
// tegelijk als seed voor de database (zie supabase/schema.sql).

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const seedAnimals: Animal[] = [
  {
    id: "a1",
    name: "Balou",
    species: "pony",
    age: 12,
    bio: "Onze grote vriendelijke reus in ponyformaat. Balou is het kloppend hart van de stal: geduldig, zachtaardig en dol op kinderen die hem borstelen.",
    traits: ["Geduldig", "Knuffelbaar", "Rustig"],
    image_url: u("photo-1598974357801-cbca100e65d3"),
    published: true,
    sort_order: 1,
  },
  {
    id: "a2",
    name: "Fjura",
    species: "paard",
    age: 9,
    bio: "Een Noorse fjord met een manenkam om jaloers op te zijn. Fjura loopt graag voorop tijdens buitenritten en vindt wortels het mooiste dat bestaat.",
    traits: ["Nieuwsgierig", "Betrouwbaar", "Buitenmens"],
    image_url: u("photo-1553284965-83fd3e82fa5a"),
    published: true,
    sort_order: 2,
  },
  {
    id: "a3",
    name: "Muis",
    species: "pony",
    age: 17,
    bio: "Klein maar wijs. Muis heeft al honderden kinderen hun eerste rondje laten rijden en weet precies wanneer iemand een beetje extra rust nodig heeft.",
    traits: ["Wijs", "Zachtaardig", "Eerste-keer-expert"],
    image_url: u("photo-1595179920064-56d95e1c8db8"),
    published: true,
    sort_order: 3,
  },
  {
    id: "a4",
    name: "Storm",
    species: "paard",
    age: 6,
    bio: "De jongste van de kudde, vol energie en levenslust. Storm leert nog elke dag bij — net als de kinderen — en is gek op spelletjes in de wei.",
    traits: ["Speels", "Energiek", "Leergierig"],
    image_url: u("photo-1534773728080-33d31da27ae5"),
    published: true,
    sort_order: 4,
  },
  {
    id: "a5",
    name: "Wolkje",
    species: "pony",
    age: 14,
    bio: "Zo wit en zacht als haar naam belooft. Wolkje is de favoriet bij kinderfeestjes en laat zich eindeloos vlechten en versieren.",
    traits: ["Fotogeniek", "Lief", "Feestbeest"],
    image_url: u("photo-1553284966-19b8815c7817"),
    published: true,
    sort_order: 5,
  },
  {
    id: "a6",
    name: "Kees",
    species: "hond",
    age: 5,
    bio: "Onze border collie en officieuze stalmanager. Kees begroet ieder kind bij het hek en houdt vanaf zijn strobaal toezicht op alles.",
    traits: ["Trouw", "Slim", "Overal bij"],
    image_url: u("photo-1503256207526-0d5d80fa2f47"),
    published: true,
    sort_order: 6,
  },
  {
    id: "a7",
    name: "Poes Praline",
    species: "kat",
    age: 8,
    bio: "Praline woont in het zadelhok en beschouwt iedere schoot als haar eigendom. Wie stil op een hooibaal zit, krijgt vanzelf bezoek.",
    traits: ["Eigenwijs", "Aanhankelijk", "Zonaanbidder"],
    image_url: u("photo-1514888286974-6c03e2ca1dba"),
    published: true,
    sort_order: 7,
  },
  {
    id: "a8",
    name: "Berend",
    species: "schaap",
    age: 4,
    bio: "Berend en zijn kleine kudde houden het gras kort en de sfeer gemoedelijk. In het voorjaar mogen kinderen helpen bij het lammetjes kijken.",
    traits: ["Gemoedelijk", "Wollig", "Grasexpert"],
    image_url: u("photo-1484557985045-edf25e08da73"),
    published: true,
    sort_order: 8,
  },
  {
    id: "a9",
    name: "De Dametjes",
    species: "kip",
    age: 2,
    bio: "Zes scharrelkippen die elke ochtend verse eieren leggen. Eieren rapen is bij ons een echt klusje voor de jongste bezoekers.",
    traits: ["Druk", "Nieuwsgierig", "Vroege vogels"],
    image_url: u("photo-1548550023-2bdb3c5beed7"),
    published: true,
    sort_order: 9,
  },
  {
    id: "a10",
    name: "Goudvinnen",
    species: "vis",
    age: 3,
    bio: "In de oude drinkbak bij de boomgaard zwemmen onze goudvissen rustig hun rondjes. Het stilste plekje van het erf.",
    traits: ["Kalm", "Glinsterend", "Zen"],
    image_url: u("photo-1522069169874-c58ec4b76be5"),
    published: true,
    sort_order: 10,
  },
];

export const seedActivities: Activity[] = [
  {
    id: "act1",
    slug: "balou-basis",
    title: "Balou Basis",
    intro:
      "Dé eerste kennismaking met pony's: borstelen, verzorgen, leiden en een eerste rondje rijden — helemaal op het tempo van je kind.",
    description: `Balou Basis is onze instapactiviteit voor kinderen die nog nooit (of bijna nooit) met pony's hebben gewerkt. In kleine groepjes van maximaal vier kinderen leren ze stap voor stap hoe je een pony benadert, borstelt, opzadelt en leidt.

We beginnen altijd op de grond. Vertrouwen komt eerst, rijden komt later. Kinderen ontdekken hoe een pony denkt, wat zijn oren vertellen en waarom rust en duidelijkheid zo belangrijk zijn. Pas als een kind er klaar voor is, maken we samen een eerste rondje aan de hand.

Iedere les sluiten we af met een verzorgmoment en iets lekkers voor pony én kind. Zo wordt elke week een klein feestje om naar uit te kijken.`,
    highlights: [
      "Kleine groepjes van maximaal 4 kinderen",
      "Eerst vertrouwen op de grond, dan pas rijden",
      "Alle veiligheidscaps en materialen aanwezig",
      "Wekelijks vast moment met vaste begeleiding",
    ],
    duration: "60 minuten",
    age_range: "4 – 8 jaar",
    group_size: "max. 4 kinderen",
    price_hint: "vanaf € 17,50 per les",
    image_url: u("photo-1594768816441-1dd241ffaa67"),
    icon: "hoof",
    published: true,
    sort_order: 1,
    seo_title: "Balou Basis – eerste kennismaking met pony's | De Weperstal",
    seo_description:
      "Balou Basis is de veilige eerste kennismaking met pony's voor kinderen van 4 tot 8 jaar. Kleine groepjes, veel aandacht en plezier bij De Weperstal in Oosterwolde.",
  },
  {
    id: "act2",
    slug: "iets-meer-paardrijden",
    title: "Iets Meer Paardrijden",
    intro:
      "Voor kinderen die de basis kennen en meer willen: zelfstandiger rijden, buitenritjes en spelenderwijs werken aan houding en balans.",
    description: `Heeft je kind de eerste stappen gezet en glinsteren de ogen bij alles wat met paarden te maken heeft? Bij Iets Meer Paardrijden bouwen we rustig verder aan zelfstandigheid in het zadel.

We werken aan balans, houding en communicatie met de pony — altijd spelenderwijs, nooit met prestatiedruk. Denk aan behendigheidsparcoursjes, spelletjes te paard en bij mooi weer korte buitenritjes door het coulisselandschap rond Oosterwolde.

Ook hier blijft verzorging een vast onderdeel: kinderen leren dat rijden begint en eindigt bij goed zorgen voor je dier.`,
    highlights: [
      "Zelfstandiger rijden in eigen tempo",
      "Buitenritjes door het Friese coulisselandschap",
      "Spelvormen in plaats van prestatiedruk",
      "Aandacht voor houding, balans en dierwelzijn",
    ],
    duration: "75 minuten",
    age_range: "7 – 13 jaar",
    group_size: "max. 5 kinderen",
    price_hint: "vanaf € 21,00 per les",
    image_url: u("photo-1450052590821-8bf91254a353"),
    icon: "saddle",
    published: true,
    sort_order: 2,
    seo_title: "Iets Meer Paardrijden – doorgroeien in het zadel | De Weperstal",
    seo_description:
      "Voor kinderen van 7 tot 13 jaar die verder willen groeien: zelfstandig rijden, buitenritjes en spelvormen bij De Weperstal in Oosterwolde.",
  },
  {
    id: "act3",
    slug: "kinderfeestjes",
    title: "Kinderfeestjes",
    intro:
      "Een verjaardag tussen de pony's: versieren, vlechten, ritjes maken en limonade in de boomgaard. Een feestje dat kinderen nooit vergeten.",
    description: `Een kinderfeestje bij De Weperstal is twee uur lang genieten. De jarige en vriendjes worden ontvangen met slingers in de stal en een pony die speciaal voor het feest is 'aangekleed'.

Het programma stellen we samen met de jarige samen: pony's borstelen en vlechten, een speurtocht over het erf, ritjes op Wolkje of Balou en natuurlijk gezamenlijk taart en limonade aan de lange tafel in de boomgaard.

Wij zorgen voor alles — begeleiding, materialen, versiering en wat lekkers. Ouders hoeven alleen maar te genieten (en foto's te maken).`,
    highlights: [
      "2 uur volledig verzorgd feestprogramma",
      "Pony versieren, vlechten en ritjes maken",
      "Speurtocht over het erf",
      "Taartmoment aan de lange tafel in de boomgaard",
    ],
    duration: "120 minuten",
    age_range: "5 – 12 jaar",
    group_size: "max. 8 kinderen",
    price_hint: "vanaf € 15,00 per kind",
    image_url: u("photo-1602166242292-93a00e63e8e8"),
    icon: "party",
    published: true,
    sort_order: 3,
    seo_title: "Kinderfeestje tussen de pony's | De Weperstal Oosterwolde",
    seo_description:
      "Vier een onvergetelijk kinderfeestje bij De Weperstal: pony's versieren, ritjes maken en taart in de boomgaard. Volledig verzorgd in Oosterwolde.",
  },
  {
    id: "act4",
    slug: "wandelen-met-pony",
    title: "Wandelen met Pony",
    intro:
      "Samen met je (klein)kind en een pony aan de hand wandelen door bos en veld. Rust, natuur en quality time in één.",
    description: `Soms hoeft het niet groots. Bij Wandelen met Pony krijg je samen met je kind een pony mee voor een begeleide wandeling door de bossen en zandpaden rond Oosterwolde.

Kinderen mogen om de beurt leiden of een stukje op de ponyrug zitten, terwijl jij ernaast loopt. Onderweg vertellen we over de natuur, de dieren en alles wat we tegenkomen. Halverwege is er een picknickmoment op een mooie plek.

Deze wandelingen zijn ook heel geschikt voor opa's en oma's die iets bijzonders met hun kleinkind willen doen, of voor gezinnen die even samen willen onthaasten.`,
    highlights: [
      "Begeleide wandeling van ± 5 km door bos en veld",
      "Kinderen leiden zelf of rijden een stukje",
      "Picknickmoment onderweg inbegrepen",
      "Ook leuk als uitje met opa en oma",
    ],
    duration: "150 minuten",
    age_range: "alle leeftijden",
    group_size: "max. 3 gezinnen",
    price_hint: "vanaf € 27,50 per pony",
    image_url: u("photo-1469122312224-c5846569feb1"),
    icon: "walk",
    published: true,
    sort_order: 4,
    seo_title: "Wandelen met een pony door bos en veld | De Weperstal",
    seo_description:
      "Wandel samen met je kind en een pony aan de hand door de natuur rond Oosterwolde. Inclusief picknick. Een uitje vol rust en verbinding.",
  },
];

export const seedStories: Story[] = [
  {
    id: "s1",
    slug: "eerste-lammetjes-van-het-voorjaar",
    title: "De eerste lammetjes van het voorjaar",
    excerpt:
      "Berend kijkt er trots bij: er lopen weer wollige wolkjes door de wei. En de kinderen van de woensdaggroep waren er als eersten bij.",
    body: `Het is elk jaar weer een klein wonder. Op een vroege dinsdagochtend, nog voor de eerste kinderen kwamen, stonden er ineens twee wankele lammetjes naast hun moeder in de wei.

De kinderen van de woensdaggroep mochten als eersten kijken — op gepaste afstand, muisstil, precies zoals we dat samen geoefend hadden. Je hoorde alleen het gras en af en toe een onderdrukt "ooooh".

Wat mij elke keer weer raakt: hoe vanzelfsprekend kinderen begrijpen dat je rustig moet zijn bij jonge dieren. Niemand hoefde het te zeggen. Ze voelden het gewoon.

De komende weken mogen de vaste groepen om de beurt helpen bij het voeren. En ja, de lammetjes hebben inmiddels namen: Wolkje Junior en Drop. Democratisch gekozen door de kinderen, met overweldigende meerderheid.`,
    cover_url: u("photo-1484557985045-edf25e08da73"),
    gallery: [u("photo-1516467508483-a7212febe31a", 1200), u("photo-1500595046743-cd271d694d30", 1200)],
    author: "Maria",
    published_at: "2026-03-28",
    published: true,
    likes: 47,
    seo_title: null,
    seo_description: null,
  },
  {
    id: "s2",
    slug: "sara-en-muis",
    title: "Hoe Sara en Muis elkaar vonden",
    excerpt:
      "Sara durfde eerst niet eens de stal in. Drie maanden later leidt ze Muis zelfstandig naar de wei. Dit is haar verhaal.",
    body: `Toen Sara (6) hier in het najaar voor het eerst kwam, bleef ze bij het hek staan. De stal in? Echt niet. Pony's waren groot, en groot was spannend.

We hebben niets geforceerd. Sara mocht kijken, wortels aangeven over het hek, en verder helemaal niets. Week twee: één stap de stal in. Week vier: Muis borstelen, met mama ernaast. Week zes: Muis borstelen, zonder mama.

Afgelopen woensdag zag ik Sara met het halstertouw in haar hand door het gras lopen, Muis rustig achter haar aan. Ze keek niet eens om — ze wíst dat Muis meeliep. Dat soort vertrouwen kun je niet uitleggen, dat moet je verdienen. En Sara heeft het verdiend.

Haar moeder stond bij het hek te kijken. Ik geloof dat we allebei iets in ons oog hadden.`,
    cover_url: u("photo-1594768816441-1dd241ffaa67"),
    gallery: [u("photo-1598974357801-cbca100e65d3", 1200)],
    author: "Maria",
    published_at: "2026-03-14",
    published: true,
    likes: 82,
    seo_title: null,
    seo_description: null,
  },
  {
    id: "s3",
    slug: "modderdag",
    title: "Modderdag (of: waarom laarzen bestaan)",
    excerpt:
      "Na een week regen was de wei één grote modderpoel. Wij zagen een probleem, de kinderen zagen het beste speelterrein ooit.",
    body: `Er zijn dagen waarop je planning het aflegt tegen het weer. Vorige week was zo'n week: zeven dagen regen, en de paddock veranderde in iets wat het midden hield tussen een wei en chocolademousse.

Plan A (buitenritje) kon niet doorgaan. Plan B werd geboren door de kinderen zelf: laarzenrace, modderkastelen bouwen, en Kees de hond die besloot dat hij vandaag officieel een bruine hond was.

De pony's stonden er vanuit de droge stal hoofdschuddend naar te kijken. Balou kreeg naderhand het beste borstelmoment van zijn leven, want ook hij had natuurlijk stiekem in de modder gestaan.

Aan alle ouders die die middag kinderen ophaalden die eruitzagen alsof ze door een veenmoeras waren gekropen: het spijt ons niets. Kijk naar die koppies.`,
    cover_url: u("photo-1444212477490-ca407925329e"),
    gallery: [u("photo-1503256207526-0d5d80fa2f47", 1200), u("photo-1469122312224-c5846569feb1", 1200)],
    author: "Maria",
    published_at: "2026-02-20",
    published: true,
    likes: 63,
    seo_title: null,
    seo_description: null,
  },
  {
    id: "s4",
    slug: "winterochtend-in-de-stal",
    title: "Een winterochtend in de stal",
    excerpt:
      "Bevroren adem, warme paardenlijven en dampende thee. Waarom de winter stiekem het mooiste seizoen op stal is.",
    body: `Iedereen denkt bij een ponystal aan de zomer. Maar wie hier op een vrieskoude zaterdagochtend komt, ontdekt een geheim: de winter is misschien wel het mooiste seizoen.

De stal is dan een warme, dampende wereld van hooi en paardenadem. Kinderen komen binnen met rode wangen en verdwijnen tussen de dieren, waar het altijd een paar graden warmer is. Fjura's wintervacht is zo dik dat je vingers erin verdwijnen.

Op zulke ochtenden doen we alles rustiger. Extra lang borstelen. Warme thee aan de staltafel. En als het gevroren heeft, kraakt de wei onder de hoeven tijdens een korte wandeling.

De winter leert kinderen iets belangrijks: dieren hebben je elke dag nodig, niet alleen als de zon schijnt. En gek genoeg zijn juist die koude ochtenden de momenten die ze zich later herinneren.`,
    cover_url: u("photo-1516467508483-a7212febe31a"),
    gallery: [u("photo-1553284965-83fd3e82fa5a", 1200)],
    author: "Maria",
    published_at: "2026-01-17",
    published: true,
    likes: 51,
    seo_title: null,
    seo_description: null,
  },
  {
    id: "s5",
    slug: "waarom-we-klein-blijven",
    title: "Waarom De Weperstal klein blijft",
    excerpt:
      "We krijgen vaak de vraag of we niet willen uitbreiden. Het antwoord is nee — en dat is een heel bewuste keuze.",
    body: `Met enige regelmaat krijg ik de vraag: "Waarom nemen jullie niet meer kinderen aan? Waarom geen tweede rijbak, meer pony's, langere openingstijden?"

Het eerlijke antwoord: omdat klein precies de bedoeling is.

Ik ken ieder kind dat hier komt bij naam. Ik weet wie er een moeilijke week heeft gehad, wie er eindelijk durft te draven en wie er stiekem het liefst alleen maar knuffelt met Praline in het zadelhok. Dat kan alleen omdat we klein zijn.

Ook voor de dieren is dit belangrijk. Onze pony's werken korte dagen, staan veel in de wei en hebben net zo goed recht op vrije tijd als wij. Een pony die met plezier werkt, is een veilige pony — en dat voelen kinderen feilloos aan.

Dus nee, we worden niet groter. We worden hooguit elk jaar een beetje beter in wat we doen.`,
    cover_url: u("photo-1500595046743-cd271d694d30"),
    gallery: [],
    author: "Maria",
    published_at: "2025-12-05",
    published: true,
    likes: 96,
    seo_title: null,
    seo_description: null,
  },
];

export const seedTeam: TeamMember[] = [
  {
    id: "t1",
    name: "Maria",
    role: "Oprichter & hoofdbegeleider",
    bio: "Maria groeide zelf op tussen de paarden en droomde als kind al van een eigen plek waar dieren en kinderen samen kunnen groeien. Sinds de oprichting van De Weperstal begeleidt ze iedere groep persoonlijk. Haar motto: eerst vertrouwen, dan pas rijden.",
    image_url: u("photo-1544005313-94ddf0286df2", 800),
    published: true,
    sort_order: 1,
  },
  {
    id: "t2",
    name: "Jelte",
    role: "Stalhulp & buitenritbegeleider",
    bio: "Jelte kent elk zandpad rond Oosterwolde en loopt mee tijdens de ponywandelingen en buitenritten. Handig met hoeven, hekken en het kalmeren van zenuwachtige ouders.",
    image_url: u("photo-1500648767791-00dcc994a43e", 800),
    published: true,
    sort_order: 2,
  },
  {
    id: "t3",
    name: "Femke",
    role: "Begeleider kinderfeestjes",
    bio: "Femke tovert de stal om voor ieder feestje en verzint speurtochten waar kinderen weken later nog over praten. Studeert pedagogiek en is elke zaterdag op stal te vinden.",
    image_url: u("photo-1438761681033-6461ffad8d80", 800),
    published: true,
    sort_order: 3,
  },
];

export const seedContent: Record<string, string> = {
  hero_title: "Welkom bij De Weperstal",
  hero_subtitle: "Een plek waar kinderen dromen beleven tussen de paarden en pony's.",
  hero_tagline: "Laat je kind genieten van plezier, natuur en avontuur.",
  intro_title: "Opgroeien tussen dieren en natuur",
  intro_text:
    "De Weperstal is geen gewone manege. Het is een kleinschalig erf aan de rand van Oosterwolde waar kinderen op hun eigen tempo leren omgaan met paarden, pony's en al het andere leven op de boerderij. Geen prestatiedruk, wel modder aan je laarzen, wind in je haren en dieren die je leren wie je bent.",
  about_lead:
    "Waarom De Weperstal bestaat? Omdat ieder kind een plek verdient waar het gewoon kind mag zijn — tussen dieren die niet oordelen en natuur die alle tijd heeft.",
  cta_title: "Kom eens langs",
  cta_text:
    "De beste manier om De Weperstal te leren kennen is door het zelf te voelen. Plan een vrijblijvende kennismaking en ontdek of dit de plek is voor jouw kind.",
  contact_intro:
    "Vragen, een kennismaking plannen of een feestje aanvragen? Stuur ons een bericht — we antwoorden meestal binnen één werkdag.",
};
