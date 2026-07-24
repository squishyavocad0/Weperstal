import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/site/Hero";
import StorySlider from "@/components/site/StorySlider";
import { MeadowDivider, Reveal } from "@/components/site/Nature";
import { MeadowColor } from "@/components/site/FooterMeadow";
import { MEADOW_COLORS } from "@/components/site/meadowColors";
import { ActivityCard, SectionHeading } from "@/components/site/ui";
import { getActivities, getAnimals, getContent, getStories } from "@/lib/data";
import { speciesLabel } from "@/lib/utils";

export default async function HomePage() {
  const [content, activities, animals, stories] = await Promise.all([
    getContent(),
    getActivities(),
    getAnimals(),
    getStories(),
  ]);

  const featuredAnimals = animals.slice(0, 3);

  const gallery = [
    {
      src: "https://images.unsplash.com/photo-1594768816441-1dd241ffaa67?auto=format&fit=crop&w=1200&q=80",
      alt: "Kind borstelt een pony",
    },
    {
      src: "https://images.unsplash.com/photo-1469122312224-c5846569feb1?auto=format&fit=crop&w=1200&q=80",
      alt: "Wandeling met pony door het bos",
    },
    {
      src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
      alt: "Paarden in de ochtendzon",
    },
    {
      src: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80",
      alt: "Paard in de wei bij zonsondergang",
    },
  ];

  return (
    <>
      <Hero
        title={content.hero_title}
        subtitle={content.hero_subtitle}
        tagline={content.hero_tagline}
      />

      {/* Introductie */}
      <section className="relative bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Welkom op ons erf"
              title={content.intro_title}
              text={content.intro_text}
            />
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {gallery.map((img, i) => (
                <div
                  key={img.src}
                  className={`relative overflow-hidden rounded-organic shadow-soft ${
                    i % 2 === 1 ? "md:translate-y-8" : ""
                  } aspect-[3/4]`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <MeadowDivider from="#F9F5EC" to="#E9F0E4" />

      {/* Activiteiten */}
      <section className="bg-sage-whisper pb-20 pt-12 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Wat we doen"
              title="Van eerste aai tot eerste galop"
              text="Vier activiteiten, één gedachte: ieder kind groeit op zijn eigen tempo. Kies wat past — of kom gewoon eens kijken."
            />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-2">
            {activities.map((a, i) => (
              <Reveal key={a.id} delay={i * 100}>
                <ActivityCard activity={a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <MeadowDivider from="#E9F0E4" to="#F9F5EC" />

      {/* Uitgelichte dieren */}
      <section className="bg-cream pb-20 pt-12 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Onze dieren"
              title="Maak kennis met de bewoners"
              text="Iedere pony, hond en kip op ons erf heeft een eigen karakter. Deze drie stellen zich alvast voor."
            />
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {featuredAnimals.map((animal, i) => (
              <Reveal key={animal.id} delay={i * 100}>
                <Link
                  href={animal.slug ? `/dieren/${animal.slug}` : "/dieren"}
                  className="group block overflow-hidden rounded-organic bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lifted"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={animal.image_url}
                      alt={animal.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-display text-2xl text-forest-deep">
                      {animal.name}
                    </h3>
                    <p className="mt-1 text-sm text-bark">
                      {speciesLabel[animal.species]} · {animal.age} jaar
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-12 text-center">
              <Link
                href="/dieren"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-forest shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
              >
                Ontmoet alle dieren
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Verhalen-slider */}
      <section className="bg-cream pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Vers van het erf"
              title="De nieuwste verhalen"
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-10">
              <StorySlider stories={stories.slice(0, 5)} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Afsluitende CTA */}
      <section className="relative overflow-hidden bg-forest py-20 md:py-28">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-96 w-96 rounded-blob bg-forest-mist/40"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -left-20 h-80 w-80 rounded-blob bg-sage/20"
        />
        <div className="relative mx-auto max-w-2xl px-5 text-center md:px-8">
          <Reveal>
            <h2 className="font-display text-3xl leading-tight text-cream md:text-4xl">
              {content.cta_title}
            </h2>
            <p className="mt-5 leading-relaxed text-cream/80">{content.cta_text}</p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="rounded-full bg-cream px-8 py-4 font-semibold text-forest-deep shadow-lifted transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Plan een kennismaking
              </Link>
              <Link
                href="/activiteiten"
                className="rounded-full border-2 border-cream/60 px-8 py-4 font-semibold text-cream transition-all hover:-translate-y-0.5 hover:border-cream hover:bg-cream/10"
              >
                Bekijk activiteiten
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <MeadowColor color={MEADOW_COLORS.forest} />
    </>
  );
}
