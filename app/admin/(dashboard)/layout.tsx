"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { HoofMark } from "@/components/site/Header";

const nav = [
  { href: "/admin", label: "Overzicht", icon: "🏡" },
  { href: "/admin/dieren", label: "Dieren", icon: "🐴" },
  { href: "/admin/verhalen", label: "Verhalen", icon: "📖" },
  { href: "/admin/activiteiten", label: "Activiteiten", icon: "🎠" },
  { href: "/admin/team", label: "Team", icon: "👋" },
  { href: "/admin/teksten", label: "Teksten", icon: "✏️" },
  { href: "/admin/berichten", label: "Berichten", icon: "✉️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    if (supabaseConfigured) {
      await createClient().auth.signOut();
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Zijbalk */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-forest-deep text-cream transition-transform md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 py-6">
          <HoofMark className="h-8 w-8 text-gold" />
          <div>
            <p className="font-display text-lg leading-tight">De Weperstal</p>
            <p className="text-xs text-cream/60">Beheer</p>
          </div>
        </div>
        <nav className="mt-2 px-3" aria-label="Beheermenu">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`mb-1 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  active
                    ? "bg-cream/15 text-cream"
                    : "text-cream/70 hover:bg-cream/10 hover:text-cream"
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 space-y-1 p-4">
          <Link
            href="/"
            className="block rounded-2xl px-4 py-2.5 text-sm text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            ↗ Bekijk de website
          </Link>
          <button
            onClick={signOut}
            className="w-full rounded-2xl px-4 py-2.5 text-left text-sm text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            Uitloggen
          </button>
        </div>
      </aside>

      {open && (
        <button
          aria-label="Menu sluiten"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/40 md:hidden"
        />
      )}

      {/* Inhoud */}
      <div className="min-w-0 flex-1">
        <header className="flex items-center gap-4 border-b border-sage-light/60 bg-white px-5 py-4 md:px-8">
          <button
            className="rounded-xl p-2 text-forest md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Menu openen"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <p className="text-sm text-ink/60">
            Ingelogd als beheerder · wijzigingen zijn direct zichtbaar op de
            site zodra je publiceert
          </p>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
