import Link from "next/link";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function count(table: string) {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function AdminHome() {
  const configured = supabaseConfigured();
  const [animals, stories, activities, team, messages] = configured
    ? await Promise.all([
        count("animals"),
        count("stories"),
        count("activities"),
        count("team_members"),
        count("contact_messages"),
      ])
    : [0, 0, 0, 0, 0];

  const cards = [
    { href: "/admin/dieren", label: "Dieren", value: animals, icon: "🐴" },
    { href: "/admin/verhalen", label: "Verhalen", value: stories, icon: "📖" },
    { href: "/admin/activiteiten", label: "Activiteiten", value: activities, icon: "🎠" },
    { href: "/admin/team", label: "Teamleden", value: team, icon: "👋" },
    { href: "/admin/berichten", label: "Berichten", value: messages, icon: "✉️" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">
        Goedemorgen, Maria
      </h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Hier beheer je alles van de website: de dieren, verhalen, activiteiten
        en teksten. Wat je verbergt, blijft als concept bewaard.
      </p>

      {!configured && (
        <div className="mt-6 rounded-organic bg-gold-soft/40 p-6 text-sm leading-relaxed text-bark-deep">
          <p className="font-semibold">Database nog niet gekoppeld</p>
          <p className="mt-1">
            Vul de Supabase-gegevens in het <code>.env</code>-bestand in en
            voer <code>supabase/schema.sql</code> uit. Zie de README voor de
            stappen. Tot die tijd toont de site de ingebouwde voorbeeldcontent.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-organic bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
          >
            <p className="text-3xl" aria-hidden="true">{c.icon}</p>
            <p className="mt-3 font-display text-3xl text-forest-deep">
              {c.value}
            </p>
            <p className="text-sm text-ink/60">{c.label}</p>
          </Link>
        ))}
        <Link
          href="/admin/teksten"
          className="rounded-organic bg-white p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lifted"
        >
          <p className="text-3xl" aria-hidden="true">✏️</p>
          <p className="mt-3 font-display text-xl text-forest-deep">
            Teksten aanpassen
          </p>
          <p className="text-sm text-ink/60">
            Homepage- en paginateksten wijzigen
          </p>
        </Link>
      </div>
    </div>
  );
}
