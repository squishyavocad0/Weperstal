"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/activiteiten", label: "Activiteiten" },
  { href: "/dieren", label: "Onze dieren" },
  { href: "/verhalen", label: "Verhalen" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const onHome = pathname === "/";
  const solid = scrolled || !onHome || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-cream/90 shadow-soft backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="De Weperstal – naar home"
        >
          <HoofMark
            className={`h-9 w-9 transition-colors ${
              solid ? "text-forest" : "text-cream"
            }`}
          />
          <span
            className={`font-display text-xl tracking-wide transition-colors ${
              solid ? "text-forest-deep" : "text-cream"
            }`}
          >
            De Weperstal
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Hoofdmenu">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? solid
                      ? "bg-sage-whisper text-forest-deep"
                      : "bg-cream/20 text-cream"
                    : solid
                      ? "text-ink/70 hover:bg-sage-whisper hover:text-forest-deep"
                      : "text-cream/85 hover:bg-cream/15 hover:text-cream"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            className="ml-3 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lifted"
          >
            Maak kennis
          </Link>
        </nav>

        <button
          className={`md:hidden rounded-full p-2 transition-colors ${
            solid ? "text-forest-deep" : "text-cream"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-sage-light/60 bg-cream px-5 pb-6 pt-2 md:hidden"
          aria-label="Mobiel menu"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-xl px-4 py-3 text-base font-medium text-ink/80 hover:bg-sage-whisper hover:text-forest-deep"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="mt-3 block rounded-full bg-forest px-5 py-3 text-center font-semibold text-cream"
          >
            Maak kennis
          </Link>
        </nav>
      )}
    </header>
  );
}

export function HoofMark({ className = "" }: { className?: string }) {
  // Hoefijzer met grasje — het beeldmerk van De Weperstal
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 6c-7.5 0-13 6-13 14 0 5 2 9.5 5 13l3-2.5c-2.4-2.9-4-6.5-4-10.5 0-5.8 3.9-10 9-10s9 4.2 9 10c0 4-1.6 7.6-4 10.5l3 2.5c3-3.5 5-8 5-13 0-8-5.5-14-13-14Z"
        fill="currentColor"
      />
      <path
        d="M20 22v8M20 26c-1.5-1.5-3-2-4.5-2M20 25c1.2-1.8 2.6-2.6 4-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
