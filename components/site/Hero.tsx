"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { DriftingLeaves, SunlitDust } from "./Nature";

export default function Hero({
  title,
  subtitle,
  tagline,
}: {
  title: string;
  subtitle: string;
  tagline: string;
}) {
  const imgRef = useRef<HTMLDivElement>(null);

  // Subtiel parallax-effect op de hero-foto
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (imgRef.current) {
          imgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px) scale(1.08)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div ref={imgRef} className="absolute inset-0 scale-[1.08] will-change-transform">
        <Image
          src="/hero-prins.jpg"
          alt="Meisje op shetlandpony Prins in een bloemenwei bij De Weperstal"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_22%]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-forest-deep/70" />
      <SunlitDust />
      <DriftingLeaves />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center text-cream">
        <p
          className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-gold-soft"
          style={{ animationDelay: "0.1s" }}
        >
          Oosterwolde · Fryslân
        </p>
        <h1
          className="animate-fade-up mt-5 font-display text-4xl leading-tight md:text-6xl"
          style={{ animationDelay: "0.25s" }}
        >
          {title}
        </h1>
        <p
          className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream/90 md:text-xl"
          style={{ animationDelay: "0.45s" }}
        >
          {subtitle}
        </p>
        <p
          className="animate-fade-up mt-3 text-cream/75"
          style={{ animationDelay: "0.6s" }}
        >
          {tagline}
        </p>
        <div
          className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.75s" }}
        >
          <Link
            href="/activiteiten"
            className="rounded-full bg-cream px-8 py-4 font-semibold text-forest-deep shadow-lifted transition-all hover:-translate-y-0.5 hover:bg-white"
          >
            Bekijk activiteiten
          </Link>
          <Link
            href="/contact"
            className="rounded-full border-2 border-cream/70 px-8 py-4 font-semibold text-cream backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-cream hover:bg-cream/10"
          >
            Maak kennis
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-cream/70" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
