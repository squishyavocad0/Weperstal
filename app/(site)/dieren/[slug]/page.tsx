import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/site/Nature";
import { getAnimal } from "@/lib/data";
import { speciesLabel } from "@/lib/utils";

/* Altijd vers uit de database: een nieuw dier heeft zo meteen een
   werkende pagina, zonder her-deploy. */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const animal = await getAnimal(params.slug);
  if (!animal) return {};
  const title = `${animal.name} — ${speciesLabel[animal.species]} van De Weperstal`;
  return {
    title,
    description: animal.bio,
    openGraph: {
      title,
      description: animal.bio,
      images: [{ url: animal.image_url }],
    },
  };
}

export default async function AnimalDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const animal = await getAnimal(params.slug);
  if (!animal) notFound();

  const paragraphs = animal.story
    ? animal.story.split("\n\n").filter((p) => p.trim())
    : [];

  return (
    <article className="bg-cream pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Link
          href="/dieren"
          className="inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest-deep"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Alle dieren
        </Link>

        <Reveal>
          <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-bark">
            {speciesLabel[animal.species]} · {animal.age} jaar
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            {animal.name}
          </h1>
        </Reveal>

        {animal.traits.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Karakter">
            {animal.traits.map((t) => (
              <li
                key={t}
                className="rounded-full bg-sage-whisper px-3.5 py-1.5 text-sm font-medium text-forest"
              >
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mx-auto mt-10 max-w-3xl px-5 md:px-8">
        <div className="relative aspect-[4/3] overflow-hidden rounded-organic shadow-lifted">
          <Image
            src={animal.image_url}
            alt={`${animal.name}, ${speciesLabel[animal.species].toLowerCase()} van De Weperstal`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl space-y-4 px-5 text-lg leading-relaxed text-ink/80 md:px-8">
        <p className="font-medium text-ink">{animal.bio}</p>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {animal.gallery.length > 0 && (
        <div className="mx-auto mt-8 grid max-w-3xl gap-5 px-5 sm:grid-cols-2 md:px-8">
          {animal.gallery.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[4/3] overflow-hidden rounded-organic shadow-soft"
            >
              <Image
                src={src}
                alt={`Foto ${i + 1} van ${animal.name}`}
                fill
                sizes="(max-width: 640px) 100vw, 384px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto mt-14 max-w-3xl px-5 md:px-8">
        <div className="rounded-organic bg-sage-whisper p-8 text-center">
          <p className="font-display text-2xl text-forest-deep">
            {animal.name} in het echt ontmoeten?
          </p>
          <p className="mx-auto mt-2 max-w-md text-ink/70">
            Plan een vrijblijvende kennismaking en kom langs op het erf.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-forest px-7 py-3 font-semibold text-cream shadow-soft transition-all hover:bg-forest-deep"
          >
            Maak kennis
          </Link>
        </div>
      </div>
    </article>
  );
}
