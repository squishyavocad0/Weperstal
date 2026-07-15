import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Nature";
import { HeartIcon } from "@/components/site/ui";
import { getStories } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Verhalen",
  description:
    "Verhalen van het erf: lammetjes, modderdagen en kinderen die groeien. Geschreven door Maria van De Weperstal.",
};

export default async function VerhalenPage() {
  const stories = await getStories();
  const [featured, ...rest] = stories;

  return (
    <>
      <section className="bg-sage-whisper px-5 pb-16 pt-36 md:px-8 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
            Verhalen
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            Vers van het erf
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Grote en kleine momenten van De Weperstal, opgeschreven door Maria.
            Van de eerste lammetjes tot kinderen die boven zichzelf uitgroeien.
          </p>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {featured && (
            <Reveal>
              <Link
                href={`/verhalen/${featured.slug}`}
                className="group grid overflow-hidden rounded-organic bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lifted md:grid-cols-2"
              >
                <div className="relative aspect-[4/3] md:aspect-auto">
                  <Image
                    src={featured.cover_url}
                    alt={featured.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
                    Nieuwste verhaal
                  </p>
                  <h2 className="mt-3 font-display text-3xl leading-snug text-forest-deep">
                    {featured.title}
                  </h2>
                  <p className="mt-4 leading-relaxed text-ink/70">
                    {featured.excerpt}
                  </p>
                  <p className="mt-6 flex items-center gap-2 text-sm text-ink/50">
                    <HeartIcon className="h-4 w-4 text-bark" filled />
                    {featured.likes}
                    <span aria-hidden="true">·</span>
                    {formatDate(featured.published_at)}
                    <span aria-hidden="true">·</span>
                    door {featured.author}
                  </p>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((story, i) => (
              <Reveal key={story.id} delay={(i % 3) * 90}>
                <Link
                  href={`/verhalen/${story.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-organic bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lifted"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={story.cover_url}
                      alt={story.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs text-bark">
                      {formatDate(story.published_at)}
                    </p>
                    <h3 className="mt-2 font-display text-xl leading-snug text-forest-deep">
                      {story.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">
                      {story.excerpt}
                    </p>
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-ink/50">
                      <HeartIcon className="h-4 w-4 text-bark" filled />
                      {story.likes}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
