"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import AlleenBeheerder from "@/components/admin/AlleenBeheerder";

interface AdminUser {
  user_id: string;
  email: string;
  role: string;
}

const roleLabels: Record<string, string> = {
  beheerder: "Beheerder — mag alles",
  stalhulp: "Stalhulp — alleen dieren en verhalen",
};

export default function AdminGebruikers() {
  const supabase = useMemo(
    () => (supabaseConfigured ? createClient() : null),
    []
  );
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return setLoading(false);
    const [{ data }, { data: userData }] = await Promise.all([
      supabase.rpc("admin_users_overzicht"),
      supabase.auth.getUser(),
    ]);
    if (Array.isArray(data)) setUsers(data as AdminUser[]);
    setMyId(userData.user?.id ?? null);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setRole = async (user: AdminUser, role: string) => {
    if (!supabase || role === user.role) return;
    const { error } = await supabase.rpc("zet_rol", {
      doel_user: user.user_id,
      nieuwe_rol: role,
    });
    if (error) {
      setMessage(`Wijzigen mislukt: ${error.message}`);
    } else {
      setMessage(`${user.email} is nu ${role}.`);
      load();
    }
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-forest-deep">Gebruikers</h1>
      <p className="mt-2 max-w-xl text-ink/60">
        Wie kan er inloggen op het beheer, en wat mag diegene? Stalhulpen
        kunnen alleen dieren en verhalen beheren (en foto&apos;s uploaden);
        beheerders kunnen alles.
      </p>

      <AlleenBeheerder>
        {message && (
          <p
            className="mt-4 rounded-2xl bg-sage-whisper px-4 py-3 text-sm text-forest-deep"
            role="status"
          >
            {message}
          </p>
        )}

        {loading ? (
          <p className="mt-10 text-ink/50">Laden…</p>
        ) : (
          <ul className="mt-8 space-y-3">
            {users.map((u) => (
              <li
                key={u.user_id}
                className="flex flex-wrap items-center gap-4 rounded-organic bg-white p-5 shadow-soft"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{u.email}</p>
                  <p className="text-sm text-ink/50">
                    {roleLabels[u.role] ?? u.role}
                    {u.user_id === myId && " · dit ben jij"}
                  </p>
                </div>
                <select
                  value={u.role}
                  disabled={u.user_id === myId}
                  onChange={(e) => setRole(u, e.target.value)}
                  className="rounded-2xl border border-sage-light bg-cream-soft px-4 py-2.5 text-sm outline-none focus:border-forest disabled:opacity-50"
                  aria-label={`Rol van ${u.email}`}
                >
                  <option value="beheerder">Beheerder</option>
                  <option value="stalhulp">Stalhulp</option>
                </select>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 rounded-organic bg-cream-soft p-6 text-sm leading-relaxed text-ink/70">
          <p className="font-semibold text-ink">
            Iemand nieuw toegang geven?
          </p>
          <p className="mt-1">
            Nieuwe accounts maak je aan in Supabase: Authentication →
            Users → &ldquo;Add user&rdquo; (e-mailadres + wachtwoord).
            Daarna verschijnt het account hier, standaard als stalhulp.
          </p>
        </div>
      </AlleenBeheerder>
    </div>
  );
}
