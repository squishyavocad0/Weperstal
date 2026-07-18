"use client";

import { useBeheerder } from "@/components/admin/useBeheerder";

/* Schermt een beheerpagina af voor stalhulpen. De echte beveiliging
   zit in de database (row level security); dit onderdeel zorgt vooral
   voor een vriendelijke uitleg in plaats van rare foutmeldingen. */
export default function AlleenBeheerder({
  children,
}: {
  children: React.ReactNode;
}) {
  const beheerder = useBeheerder();

  if (beheerder === null) {
    return <p className="mt-10 text-ink/50">Laden…</p>;
  }

  if (!beheerder) {
    return (
      <div className="mt-10 rounded-organic bg-white p-8 shadow-soft">
        <p className="font-display text-xl text-forest-deep">
          Dit deel is alleen voor beheerders
        </p>
        <p className="mt-2 max-w-lg text-ink/60">
          Jij kunt de dieren en verhalen beheren. Moet hier toch iets
          aangepast worden? Vraag het aan Maria — of laat haar je account
          tot beheerder maken via de pagina Gebruikers.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
