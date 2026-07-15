import type { Metadata } from "next";
import AnimalExplorer from "@/components/site/AnimalExplorer";
import { getAnimals } from "@/lib/data";

export const metadata: Metadata = {
  title: "Onze dieren",
  description:
    "Maak kennis met de paarden, pony's, honden, katten, schapen, kippen en vissen van De Weperstal. Ieder dier met een eigen verhaal en karakter.",
};

export default async function DierenPage() {
  const animals = await getAnimals();

  return (
    <>
      <section className="bg-sage-whisper px-5 pb-16 pt-36 md:px-8 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
            Onze dieren
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            De bewoners van het erf
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            Van wijze pony&apos;s tot eigenwijze stalkatten: ieder dier heeft
            hier een eigen plek, een eigen verhaal en heel veel vrije tijd in
            de wei.
          </p>
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <AnimalExplorer animals={animals} />
        </div>
      </section>
    </>
  );
}
