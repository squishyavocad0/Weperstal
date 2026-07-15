import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MeadowDivider, Reveal } from "@/components/site/Nature";
import { SectionHeading, TeamCard } from "@/components/site/ui";
import { getContent, getTeam } from "@/lib/data";

export const metadata: Metadata = {
  title: "Over ons",
  description:
    "Waarom De Weperstal bestaat: het verhaal van Maria en een kleinschalige plek waar kinderen veilig opgroeien tussen paarden, pony's en natuur.",
};

export default async function OverOnsPage() {
  const [content, team] = await Promise.all([getContent(), getTeam()]);

  return (
    <>
      {/* Pagina-intro */}
      <section className="bg-sage-whisper px-5 pb-16 pt-36 md:px-8 md:pb-24 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
            Over ons
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            Waarom De Weperstal bestaat
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            {content.about_lead}
          </p>
        </div>
      </section>

      <MeadowDivider from="#E9F0E4" to="#F9F5EC" />

      {/* Het verhaal */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-organic shadow-lifted">
              <Image
                src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=80"
                alt="Paard in de ochtendmist op de wei van De Weperstal"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="space-y-5 leading-relaxed text-ink/80">
              <h2 className="font-display text-3xl text-forest-deep">
                Het begon met één pony
              </h2>
              <p>
                Maria groeide op met paarden en wist al jong: dieren geven
                kinderen iets wat geen mens ze kan geven. Rust. Eerlijkheid.
                Het gevoel dat je goed bent zoals je bent. Een pony oordeelt
                niet over je rekentoets of je nieuwe bril — hij kijkt alleen of
                je vriendelijk bent.
              </p>
              <p>
                Toen ze jaren later een oud erf aan de rand van Oosterwolde
                vond, met een scheve stal en een wei vol paardenbloemen, viel
                alles op zijn plek. De Weperstal werd de plek die ze zelf als
                kind had willen hebben: klein, warm en zonder haast.
              </p>
              <p>
                Kinderen komen hier graag terug omdat ze hier gezien worden.
                Niet als ruitertje-in-opleiding, maar als kind. Er is tijd om
                te knuffelen met Praline, eieren te rapen bij de kippen of
                gewoon in het hooi te zitten kijken hoe Balou eet.
              </p>
              <p>
                En ouders? Die voelen zich hier veilig omdat we klein blijven.
                Kleine groepen, vaste gezichten, rustige dieren en duidelijke
                afspraken. Iedereen kent iedereen — precies zoals het hoort.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Visie & missie */}
      <section className="bg-cream pb-16 md:pb-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-2 md:px-8">
          <Reveal>
            <div className="h-full rounded-organic bg-white p-8 shadow-soft md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
                Onze visie
              </p>
              <h2 className="mt-3 font-display text-2xl text-forest-deep">
                Respect voor dier en natuur, ruimte voor ieder kind
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                Een plek waar respect voor dier en natuur centraal staat, waar
                ieder kind zich welkom voelt en waar plezier, ontwikkeling en
                welzijn hand in hand gaan. We bouwen aan een hechte gemeenschap
                waarin iedereen zich thuis voelt.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-organic bg-white p-8 shadow-soft md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
                Onze missie
              </p>
              <h2 className="mt-3 font-display text-2xl text-forest-deep">
                Herinneringen voor het leven
              </h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                Kinderen een veilige, warme plek bieden waar ze kunnen groeien,
                leren en genieten tussen paarden en pony&apos;s. Dieren geven
                kinderen zelfvertrouwen, inspiratie en herinneringen voor het
                leven.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <MeadowDivider from="#F9F5EC" to="#E9F0E4" />

      {/* Team */}
      <section className="bg-sage-whisper pb-20 pt-12 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="De mensen"
              title="Wie je op het erf tegenkomt"
              text="Een klein team met één ding gemeen: onvoorwaardelijke liefde voor dieren én kinderen."
            />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {team.map((m, i) => (
              <Reveal key={m.id} delay={i * 100}>
                <TeamCard member={m} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-14 text-center">
              <Link
                href="/contact"
                className="inline-block rounded-full bg-forest px-8 py-4 font-semibold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lifted"
              >
                Kom kennismaken
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
