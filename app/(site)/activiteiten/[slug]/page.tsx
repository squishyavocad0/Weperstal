import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MeadowDivider, Reveal } from "@/components/site/Nature";
import { MeadowColor } from "@/components/site/FooterMeadow";
import { MEADOW_COLORS } from "@/components/site/meadowColors";
import { ActivityIcon } from "@/components/site/ui";
import { getActivities, getActivity } from "@/lib/data";

export async function generateStaticParams() {
  const activities = await getActivities();
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const activity = await getActivity(params.slug);
  if (!activity) return {};
  return {
    title: activity.seo_title ?? activity.title,
    description: activity.seo_description ?? activity.intro,
    openGraph: {
      title: activity.seo_title ?? activity.title,
      description: activity.seo_description ?? activity.intro,
      images: [{ url: activity.image_url }],
    },
  };
}

export default async function ActivityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const activity = await getActivity(params.slug);
  if (!activity) notFound();

  const facts = [
    { label: "Duur", value: activity.duration },
    { label: "Leeftijd", value: activity.age_range },
    { label: "Groepsgrootte", value: activity.group_size },
    { label: "Prijs", value: activity.price_hint },
  ];

  return (
    <>
      {/* Beeldheader */}
      <section className="relative flex min-h-[62vh] items-end overflow-hidden">
        <Image
          src={activity.image_url}
          alt={activity.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/85 via-ink/20 to-ink/30" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-40 md:px-8">
          <Link
            href="/activiteiten"
            className="inline-flex items-center gap-2 text-sm font-medium text-cream/80 transition-colors hover:text-cream"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m6 6-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Alle activiteiten
          </Link>
          <div className="mt-6 flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/90 text-forest shadow-soft">
              <ActivityIcon icon={activity.icon} className="h-7 w-7" />
            </span>
            <h1 className="font-display text-4xl text-cream md:text-5xl">
              {activity.title}
            </h1>
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cream/85">
            {activity.intro}
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_320px] md:px-8">
          <Reveal>
            <div className="space-y-6 leading-relaxed text-ink/80">
              {activity.description.split("\n\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}

              <h2 className="pt-4 font-display text-2xl text-forest-deep">
                Wat je kunt verwachten
              </h2>
              <ul className="space-y-3">
                {activity.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <svg
                      className="mt-1 h-5 w-5 shrink-0 text-forest"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <aside className="h-fit rounded-organic bg-white p-7 shadow-soft md:sticky md:top-28">
              <h2 className="font-display text-xl text-forest-deep">
                In het kort
              </h2>
              <dl className="mt-5 space-y-4">
                {facts.map((f) => (
                  <div key={f.label} className="flex justify-between gap-4 text-sm">
                    <dt className="text-ink/50">{f.label}</dt>
                    <dd className="text-right font-medium text-ink/85">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/contact"
                className="mt-7 block rounded-full bg-forest px-6 py-3.5 text-center font-semibold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lifted"
              >
                Aanmelden of vragen
              </Link>
              <p className="mt-4 text-center text-xs text-ink/50">
                We reageren meestal binnen één werkdag
              </p>
            </aside>
          </Reveal>
        </div>
      </section>

      <MeadowDivider from="#F9F5EC" to="#E9F0E4" />
      <section className="bg-sage-whisper pb-16 pt-8 text-center md:pb-24">
        <p className="text-ink/60">Twijfel je welke activiteit past?</p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-full bg-white px-7 py-3.5 font-semibold text-forest shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
        >
          Vraag het Maria
        </Link>
      </section>

      <MeadowColor color={MEADOW_COLORS.sageWhisper} />
    </>
  );
}
