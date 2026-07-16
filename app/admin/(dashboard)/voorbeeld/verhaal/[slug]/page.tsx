import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Story } from "@/lib/types";

export const dynamic = "force-dynamic";

/* ────────────────────────────────────────────────────────────────────────
   Voorbeeldweergave van een verhaal — óók als het nog een concept is.
   Alleen bereikbaar voor ingelogde beheerders (de /admin-middleware
   beschermt deze route), zodat Maria een verhaal rustig kan nakijken
   voordat ze het publiceert.
   ──────────────────────────────────────────────────────────────────────── */

export default async function StoryPreview({
  params,
}: {
  params: { slug: string };
}) {
  if (!supabaseConfigured()) notFound();

  const supabase = createClient();
  const { data } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", params.slug)
    .single();
  if (!data) notFound();
  const story = data as Story;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/verhalen"
          className="text-sm font-medium text-forest transition-colors hover:text-forest-deep"
        >
          ← Terug naar verhalen
        </Link>
        <span
          className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
            story.published
              ? "bg-sage-whisper text-forest-deep"
              : "bg-gold-soft/50 text-bark-deep"
          }`}
        >
          {story.published
            ? "Gepubliceerd — zo staat het op de site"
            : "Voorbeeld — dit verhaal is nog een concept"}
        </span>
      </div>

      <article className="mx-auto mt-6 max-w-3xl rounded-organic bg-white p-6 shadow-soft md:p-10">
        <p className="text-sm text-bark">
          {formatDate(story.published_at)} · door {story.author}
        </p>
        <h1 className="mt-3 font-display text-3xl leading-tight text-forest-deep md:text-4xl">
          {story.title}
        </h1>

        {story.cover_url && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-organic shadow-soft">
            <Image
              src={story.cover_url}
              alt={story.title}
              fill
              sizes="(max-width: 1024px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-8 space-y-4 text-lg leading-relaxed text-ink/80">
          {story.body.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {story.gallery.length > 0 && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {story.gallery.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-[4/3] overflow-hidden rounded-organic shadow-soft"
              >
                <Image
                  src={src}
                  alt={`Foto ${i + 1} bij ${story.title}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 384px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
