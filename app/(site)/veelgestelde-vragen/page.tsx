import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/site/Nature";
import { getFaqs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden op veelgestelde vragen over De Weperstal: leeftijden, kleding, veiligheid, het weer en meer.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <div className="bg-cream pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-bark">
            Goed om te weten
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-forest-deep md:text-5xl">
            Veelgestelde vragen
          </h1>
        </Reveal>

        {faqs.length === 0 ? (
          <p className="mt-10 rounded-organic bg-white p-8 text-ink/60 shadow-soft">
            We zijn deze pagina nog aan het vullen. Zit je met een vraag?{" "}
            <Link href="/contact" className="font-medium text-forest underline underline-offset-2">
              Stel &apos;m gerust via het contactformulier
            </Link>
            {" "}— we antwoorden meestal binnen één werkdag.
          </p>
        ) : (
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.id}
                className="group rounded-organic bg-white shadow-soft"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-forest transition-transform group-open:rotate-45"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 leading-relaxed text-ink/70">
                  {faq.answer.split("\n\n").map((p, i) => (
                    <p key={i} className={i > 0 ? "mt-3" : ""}>
                      {p}
                    </p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}

        {faqs.length > 0 && (
          <p className="mt-10 text-center text-ink/60">
            Staat je vraag er niet bij?{" "}
            <Link href="/contact" className="font-medium text-forest underline underline-offset-2">
              Neem gerust contact op
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
