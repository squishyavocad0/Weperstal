"use client";

import { useRef } from "react";
import type { Story } from "@/lib/types";
import { StoryCard } from "./ui";

export default function StorySlider({ stories }: { stories: Story[] }) {
  const track = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    track.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={track}
        className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-4 pt-2"
      >
        {stories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-3 md:absolute md:-top-16 md:right-0 md:mt-0">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Vorige verhalen"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="Volgende verhalen"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
