import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeButton from "@/components/site/LikeButton";
import { Reveal } from "@/components/site/Nature";
import { StoryCard } from "@/components/site/ui";
import { getStories, getStory } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const story = await getStory(params.slug);
  if (!story) return {};
  return {
    title: story.seo_title ?? story.title,
    description: story.seo_description ?? story.excerpt,
    openGraph: {
      title: story.seo_title ?? story.title,
      description: story.seo_description ?? story.excerpt,
      images: [{ url: story.cover_url }],
      type: "article",
    },
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const story = await getStory(params.slug);
  if (!story) notFound();

  const others = (await getStories())
    .filter((s) => s.id !== story.id)
    .slice(0, 3);

  return (
    <>
      <article className="bg-cream pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link
            href="/verhalen"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-forest-deep"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Alle verhalen
          </Link>

          <p className="mt-8 text-sm text-bark">
            {formatDate(story.published_at)} · door {story.author}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            {story.title}
          </h1>
        </div>

        <div className="mx-auto mt-10 max-w-4xl px-5 md:px-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-organic shadow-lifted">
            <Image
              src={story.cover_url}
              alt={story.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="prose-story mx-auto mt-12 max-w-3xl px-5 text-lg md:px-8">
          {story.body.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {story.gallery.length > 0 && (
          <div className="mx-auto mt-6 grid max-w-4xl gap-5 px-5 sm:grid-cols-2 md:px-8">
            {story.gallery.map((src, i) => (
              <div
                key={src}
                className="relative aspect-[4/3] overflow-hidden rounded-organic shadow-soft"
              >
                <Image
                  src={src}
                  alt={`Foto ${i + 1} bij ${story.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 448px"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mx-auto mt-12 flex max-w-3xl justify-center px-5 md:px-8">
          <LikeButton storyId={story.id} initialLikes={story.likes} />
        </div>
      </article>

      {others.length > 0 && (
        <section className="bg-sage-whisper py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <Reveal>
              <h2 className="text-center font-display text-3xl text-forest-deep">
                Lees ook
              </h2>
            </Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {others.map((s) => (
                <StoryCard key={s.id} story={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
