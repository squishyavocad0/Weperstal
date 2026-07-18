"use client";

import { useEffect, useState } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";

/* Is de ingelogde gebruiker een beheerder?
   null = nog aan het laden; true/false = antwoord van de database.
   Zonder gekoppelde database (voorbeeldmodus) doen we alsof iedereen
   beheerder is, zodat het beheer lokaal volledig te bekijken is. */
export function useBeheerder(): boolean | null {
  const [beheerder, setBeheerder] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabaseConfigured) {
      setBeheerder(true);
      return;
    }
    createClient()
      .rpc("is_beheerder")
      .then(({ data, error }) => {
        // Als rollen.sql nog niet is uitgevoerd bestaat de functie niet;
        // dan gedraagt alles zich zoals voorheen (iedereen beheerder).
        setBeheerder(error ? true : Boolean(data));
      });
  }, []);

  return beheerder;
}
