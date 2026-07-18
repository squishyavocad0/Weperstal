"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import AlleenBeheerder from "@/components/admin/AlleenBeheerder";
import type { ContactMessage } from "@/lib/types";

export default function AdminBerichten() {
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data as ContactMessage[]) ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHandled = async (m: ContactMessage) => {
    if (!supabase) return;
    await supabase
      .from("contact_messages")
      .update({ handled: !m.handled })
      .eq("id", m.id);
    load();
  };

  const remove = async (m: ContactMessage) => {
    if (!supabase) return;
    if (!confirm(`Bericht van ${m.name} definitief verwijderen?`)) return;
    await supabase.from("contact_messages").delete().eq("id", m.id);
    load();
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-forest-deep">Berichten</h1>
      <p className="mt-2 text-ink/60">
        Alle berichten die via het contactformulier binnenkomen.
      </p>
      <AlleenBeheerder>

      {!supabaseConfigured ? (
        <p className="mt-6 rounded-organic bg-gold-soft/40 p-5 text-sm text-bark-deep">
          De database is nog niet gekoppeld — berichten verschijnen hier zodra
          Supabase is ingesteld (zie README).
        </p>
      ) : loading ? (
        <p className="mt-8 text-ink/50">Laden…</p>
      ) : messages.length === 0 ? (
        <p className="mt-8 rounded-organic bg-white p-8 text-center text-ink/60 shadow-soft">
          Nog geen berichten. Zodra iemand het contactformulier invult,
          verschijnt het hier.
        </p>
      ) : (
        <ul className="mt-8 space-y-4">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-organic bg-white p-6 shadow-soft ${
                m.handled ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-ink">
                  {m.name}
                  <span className="ml-2 text-sm font-normal text-ink/50">
                    {m.subject}
                  </span>
                </p>
                <p className="text-xs text-ink/50">
                  {new Date(m.created_at).toLocaleString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="mt-1 text-sm text-ink/60">
                <a href={`mailto:${m.email}`} className="text-forest hover:underline">
                  {m.email}
                </a>
                {m.phone && <span className="ml-3">{m.phone}</span>}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
                {m.message}
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => toggleHandled(m)}
                  className="rounded-full border border-sage-light px-4 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-sage-whisper"
                >
                  {m.handled ? "Markeer als nieuw" : "Markeer als afgehandeld"}
                </button>
                <button
                  onClick={() => remove(m)}
                  className="rounded-full px-4 py-1.5 text-xs font-medium text-bark-deep transition-colors hover:bg-gold-soft/40"
                >
                  Verwijderen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      </AlleenBeheerder>
    </div>
  );
}
