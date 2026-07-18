"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Animal, AnimalSpecies } from "@/lib/types";
import { speciesLabel, speciesPlural } from "@/lib/utils";

const filterOrder: AnimalSpecies[] = [
  "paard",
  "pony",
  "hond",
  "kat",
  "schaap",
  "kip",
  "vis",
];

export default function AnimalExplorer({ animals }: { animals: Animal[] }) {
  const [selected, setSelected] = useState<Set<AnimalSpecies>>(new Set());

  const available = useMemo(
    () => filterOrder.filter((s) => animals.some((a) => a.species === s)),
    [animals]
  );

  const visible = useMemo(
    () =>
      selected.size === 0
        ? animals
        : animals.filter((a) => selected.has(a.species)),
    [animals, selected]
  );

  const toggle = (s: AnimalSpecies) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  return (
    <div>
      <div
        className="flex flex-wrap justify-center gap-2.5"
        role="group"
        aria-label="Filter dieren op soort"
      >
        <button
          onClick={() => setSelected(new Set())}
          aria-pressed={selected.size === 0}
          className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
            selected.size === 0
              ? "bg-forest text-cream shadow-soft"
              : "bg-white text-ink/70 shadow-soft hover:bg-sage-whisper hover:text-forest-deep"
          }`}
        >
          Alle dieren
        </button>
        {available.map((s) => {
          const active = selected.has(s);
          return (
            <button
              key={s}
              onClick={() => toggle(s)}
              aria-pressed={active}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-forest text-cream shadow-soft"
                  : "bg-white text-ink/70 shadow-soft hover:bg-sage-whisper hover:text-forest-deep"
              }`}
            >
              {speciesPlural[s]}
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-ink/50" aria-live="polite">
        {visible.length === 1
          ? "1 dier"
          : `${visible.length} dieren`}{" "}
        in de wei
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((animal, i) => (
          <article
            key={animal.id}
            className="group animate-fade-up flex flex-col overflow-hidden rounded-organic bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lifted"
            style={{ animationDelay: `${(i % 6) * 70}ms` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={animal.image_url}
                alt={`${animal.name}, ${speciesLabel[animal.species].toLowerCase()} van De Weperstal`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-xs font-semibold text-forest backdrop-blur-sm">
                {speciesLabel[animal.species]}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-forest-deep">
                  {animal.name}
                </h3>
                <span className="shrink-0 text-sm text-ink/50">
                  {animal.age} jaar
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                {animal.bio}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Karakter">
                {animal.traits.map((t) => (
                  <li
                    key={t}
                    className="rounded-full bg-sage-whisper px-3 py-1 text-xs font-medium text-forest"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              {animal.slug && (
                <Link
                  href={`/dieren/${animal.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors hover:text-forest-deep"
                >
                  Lees meer over {animal.name}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-ink/60">
          Geen dieren gevonden met deze filters. Kies een andere combinatie om
          de wei weer te vullen.
        </p>
      )}
    </div>
  );
}
