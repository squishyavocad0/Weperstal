"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { seedContent } from "@/lib/seed";

/* Vriendelijke labels zodat Maria precies weet welke tekst waar staat. */
const labels: Record<string, { label: string; where: string; long?: boolean }> = {
  hero_title: { label: "Grote titel", where: "Homepage — bovenaan in het openingsbeeld" },
  hero_subtitle: { label: "Ondertitel", where: "Homepage — onder de grote titel", long: true },
  hero_tagline: { label: "Slogan", where: "Homepage — derde regel in het openingsbeeld" },
  intro_title: { label: "Introductietitel", where: "Homepage — eerste sectie" },
  intro_text: { label: "Introductietekst", where: "Homepage — eerste sectie", long: true },
  about_lead: { label: "Openingstekst", where: "Pagina Over ons — bovenaan", long: true },
  cta_title: { label: "Uitnodiging (titel)", where: "Homepage — groene blok onderaan" },
  cta_text: { label: "Uitnodiging (tekst)", where: "Homepage — groene blok onderaan", long: true },
  contact_intro: { label: "Introductietekst", where: "Pagina Contact — bovenaan", long: true },
};

export default function AdminTeksten() {
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );
  const [values, setValues] = useState<Record<string, string>>(seedContent);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("site_content")
      .select("*")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setValues((prev) => {
            const next = { ...prev };
            for (const row of data as { key: string; value: string }[]) {
              next[row.key] = row.value;
            }
            return next;
          });
        }
      });
  }, [supabase]);

  const set = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty((d) => new Set(d).add(key));
  };

  const save = async () => {
    if (!supabase) return;
    setBusy(true);
    const rows = Array.from(dirty).map((key) => ({ key, value: values[key] }));
    const { error } = await supabase
      .from("site_content")
      .upsert(rows, { onConflict: "key" });
    setBusy(false);
    if (error) {
      setMessage(`Opslaan mislukt: ${error.message}`);
    } else {
      setDirty(new Set());
      setMessage("Teksten opgeslagen. Ze staan direct op de website.");
    }
    setTimeout(() => setMessage(null), 3500);
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-forest-deep">Teksten</h1>
      <p className="mt-2 text-ink/60">
        Pas hier de vaste teksten van de website aan. Bij elk veld staat waar
        de tekst precies verschijnt.
      </p>

      {!supabaseConfigured && (
        <p className="mt-6 rounded-organic bg-gold-soft/40 p-5 text-sm text-bark-deep">
          De database is nog niet gekoppeld — teksten aanpassen kan zodra
          Supabase is ingesteld (zie README).
        </p>
      )}

      {message && (
        <p className="mt-6 rounded-2xl bg-sage-whisper px-4 py-3 text-sm text-forest-deep" role="status">
          {message}
        </p>
      )}

      <div className="mt-8 space-y-6">
        {Object.entries(labels).map(([key, meta]) => (
          <div key={key} className="rounded-organic bg-white p-6 shadow-soft">
            <label htmlFor={key} className="block font-medium text-ink">
              {meta.label}
            </label>
            <p className="mt-0.5 text-xs text-ink/50">{meta.where}</p>
            {meta.long ? (
              <textarea
                id={key}
                rows={3}
                value={values[key] ?? ""}
                onChange={(e) => set(key, e.target.value)}
                disabled={!supabaseConfigured}
                className="mt-3 w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest disabled:opacity-60"
              />
            ) : (
              <input
                id={key}
                value={values[key] ?? ""}
                onChange={(e) => set(key, e.target.value)}
                disabled={!supabaseConfigured}
                className="mt-3 w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest disabled:opacity-60"
              />
            )}
          </div>
        ))}
      </div>

      <div className="sticky bottom-4 mt-8">
        <button
          onClick={save}
          disabled={!supabaseConfigured || dirty.size === 0 || busy}
          className="rounded-full bg-forest px-8 py-3.5 font-semibold text-cream shadow-lifted transition-all hover:bg-forest-deep disabled:opacity-50"
        >
          {busy
            ? "Opslaan…"
            : dirty.size > 0
              ? `Wijzigingen opslaan (${dirty.size})`
              : "Alles opgeslagen"}
        </button>
      </div>
    </div>
  );
}
