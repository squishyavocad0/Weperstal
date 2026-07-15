import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import { Reveal } from "@/components/site/Nature";
import { getContent } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Plan een kennismaking bij De Weperstal in de omgeving van Oosterwolde. Stuur een bericht — we reageren meestal binnen één werkdag.",
};

export default async function ContactPage() {
  const content = await getContent();

  return (
    <>
      <section className="bg-sage-whisper px-5 pb-16 pt-36 md:px-8 md:pb-20 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-bark">
            Contact
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            Zeg eens hallo
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-ink/70">
            {content.contact_intro}
          </p>
        </div>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-[1.2fr_1fr] md:px-8">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <div className="overflow-hidden rounded-organic shadow-soft">
                {/* Kaart van de omgeving van Oosterwolde — bewust zonder exact adres */}
                <iframe
                  title="Omgeving van Oosterwolde, Fryslân"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=6.20%2C52.95%2C6.42%2C53.05&layer=mapnik&marker=53.003%2C6.303"
                  className="h-72 w-full border-0 md:h-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="rounded-organic bg-white p-7 shadow-soft">
                <h2 className="font-display text-xl text-forest-deep">
                  Goed om te weten
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/70">
                  <li className="flex gap-3">
                    <span aria-hidden="true">🌾</span>
                    We liggen in het buitengebied van Oosterwolde, Fryslân.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true">🐴</span>
                    Bezoek is uitsluitend op afspraak — zo blijft het rustig
                    voor de dieren en persoonlijk voor de kinderen.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true">📍</span>
                    Het exacte adres en een routebeschrijving ontvang je bij
                    de bevestiging van je afspraak.
                  </li>
                  <li className="flex gap-3">
                    <span aria-hidden="true">✉️</span>
                    Liever direct mailen? Dat kan via{" "}
                    <a
                      href="mailto:hallo@weperstal.nl"
                      className="font-medium text-forest underline-offset-2 hover:underline"
                    >
                      hallo@weperstal.nl
                    </a>
                    .
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
