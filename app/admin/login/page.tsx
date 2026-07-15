"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) return;
    setBusy(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Inloggen mislukt. Controleer je e-mailadres en wachtwoord.");
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-sage-whisper px-5">
      <div className="w-full max-w-md">
        <div className="rounded-organic bg-white p-8 shadow-lifted md:p-10">
          <p className="text-center text-4xl" aria-hidden="true">
            🐴
          </p>
          <h1 className="mt-4 text-center font-display text-2xl text-forest-deep">
            De Weperstal · Beheer
          </h1>
          <p className="mt-2 text-center text-sm text-ink/60">
            Log in om de website te beheren
          </p>

          {!supabaseConfigured ? (
            <div className="mt-8 rounded-2xl bg-gold-soft/40 p-5 text-sm leading-relaxed text-bark-deep">
              <p className="font-semibold">Database nog niet gekoppeld</p>
              <p className="mt-2">
                De website draait nu op voorbeeldcontent. Koppel Supabase via
                het <code>.env</code>-bestand om het beheer te activeren. Zie
                de README voor de stappen.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink/80">
                  E-mailadres
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none focus:border-forest"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink/80">
                  Wachtwoord
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none focus:border-forest"
                />
              </div>
              {error && (
                <p className="rounded-2xl bg-gold-soft/40 px-4 py-3 text-sm text-bark-deep" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full bg-forest px-6 py-3.5 font-semibold text-cream shadow-soft transition-all hover:bg-forest-deep disabled:opacity-60"
              >
                {busy ? "Bezig met inloggen…" : "Inloggen"}
              </button>
            </form>
          )}
        </div>
        <p className="mt-6 text-center text-sm">
          <Link href="/" className="text-forest hover:underline">
            ← Terug naar de website
          </Link>
        </p>
      </div>
    </div>
  );
}
