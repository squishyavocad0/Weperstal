"use client";

import Link from "next/link";
import { HoofMark } from "./Header";
import { MeadowDivider } from "./Nature";
import { useMeadowColor } from "./FooterMeadow";

export default function Footer() {
  const from = useMeadowColor();
  return (
    <footer className="mt-auto">
      <MeadowDivider from={from} to="#3E5439" />
      <div className="bg-forest-deep text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              <HoofMark className="h-8 w-8 text-gold" />
              <span className="font-display text-xl">De Weperstal</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/75">
              Een kleinschalige plek bij Oosterwolde waar kinderen opgroeien
              tussen paarden, pony&apos;s en het buitenleven.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="font-display text-lg text-gold-soft">Ontdek</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["/over-ons", "Over ons"],
                ["/activiteiten", "Activiteiten"],
                ["/dieren", "Onze dieren"],
                ["/verhalen", "Verhalen"],
                ["/veelgestelde-vragen", "Veelgestelde vragen"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/75 transition-colors hover:text-cream"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-lg text-gold-soft">Praktisch</h2>
            <ul className="mt-4 space-y-2 text-sm text-cream/75">
              <li>Omgeving Oosterwolde, Fryslân</li>
              <li>
                <a
                  href="mailto:hallo@weperstal.nl"
                  className="transition-colors hover:text-cream"
                >
                  hallo@weperstal.nl
                </a>
              </li>
              <li>Bezoek uitsluitend op afspraak</li>
            </ul>
            <p className="mt-6 text-xs text-cream/50">
              Het exacte adres delen we na het maken van een afspraak — zo
              blijft het rustig voor onze dieren.
            </p>
          </div>
        </div>
        <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} De Weperstal · Gemaakt met liefde voor
          dier, kind en natuur ·{" "}
          <Link
            href="/admin"
            className="transition-colors hover:text-cream/80"
          >
            Beheer
          </Link>
        </div>
      </div>
    </footer>
  );
}
