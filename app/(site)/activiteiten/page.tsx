import type { Metadata } from "next";
import { Reveal } from "@/components/site/Nature";
import { ActivityCard } from "@/components/site/ui";
import { getActivities } from "@/lib/data";

export const metadata: Metadata = {
  title: "Activiteiten",
  description:
    "Van Balou Basis tot kinderfeestjes en wandelen met een pony: ontdek alle activiteiten van De Weperstal in Oosterwolde.",
};

export default async function ActiviteitenPage() {
  const activities = await getActivities();

  return (
    <>
      <section className="bg-sage-whisper px-5 pb-16 pt-36 md:px-8 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
            Activiteiten
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            Kies jullie avontuur
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Of je kind nu voor het eerst een pony aait of al droomt van
            buitenritten: er is altijd een activiteit die past. Klein,
            persoonlijk en zonder prestatiedruk.
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-2 md:px-8">
          {activities.map((a, i) => (
            <Reveal key={a.id} delay={(i % 2) * 100}>
              <ActivityCard activity={a} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
