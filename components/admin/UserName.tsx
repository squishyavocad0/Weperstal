"use client";

import { useEffect, useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { displayName } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────
   Toont wie er is ingelogd en laat iedere beheerder een eigen naam
   kiezen. De naam wordt bewaard op het eigen account (user metadata),
   zodat meerdere mensen de site kunnen beheren zonder elkaars
   begroeting te zien.
   ──────────────────────────────────────────────────────────────────────── */

export default function UserName() {
  const [name, setName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) return;
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        const user = data.user;
        if (!user) return;
        setName(displayName(user.user_metadata?.full_name, user.email));
      });
  }, []);

  const save = async () => {
    const newName = draft.trim();
    if (!newName) return setEditing(false);
    setBusy(true);
    const { error } = await createClient().auth.updateUser({
      data: { full_name: newName },
    });
    setBusy(false);
    if (!error) {
      setName(newName);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <label htmlFor="user-name" className="sr-only">
          Jouw naam
        </label>
        <input
          id="user-name"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Jouw naam"
          className="w-36 rounded-xl border border-sage-light bg-cream-soft px-3 py-1.5 outline-none focus:border-forest"
        />
        <button
          onClick={save}
          disabled={busy}
          className="rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-cream disabled:opacity-60"
        >
          {busy ? "…" : "Opslaan"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-ink/50 hover:text-ink"
        >
          Annuleren
        </button>
      </span>
    );
  }

  return (
    <span className="text-sm text-ink/60">
      Ingelogd als <strong className="font-medium">{name ?? "beheerder"}</strong>
      {" · "}
      <button
        onClick={() => {
          setDraft(name ?? "");
          setEditing(true);
        }}
        className="underline decoration-sage-light underline-offset-2 hover:text-ink"
      >
        naam wijzigen
      </button>
    </span>
  );
}
