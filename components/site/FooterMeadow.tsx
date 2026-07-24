"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MEADOW_COLORS } from "./meadowColors";

/* ────────────────────────────────────────────────────────────────────────
   De weide-overgang in de footer heeft een eigen achtergrondkleur nodig
   die aansluit op de sectie die er direct boven staat — anders ontstaat
   er een zichtbare naad. Pagina's die met iets anders dan crème eindigen
   melden dat via <MeadowColor>; de footer leest de actuele kleur hier.
   ──────────────────────────────────────────────────────────────────────── */

const MeadowContext = createContext<{
  color: string;
  setColor: (c: string | null) => void;
}>({ color: MEADOW_COLORS.cream, setColor: () => {} });

export function FooterMeadowProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [color, setColorState] = useState<string>(MEADOW_COLORS.cream);
  return (
    <MeadowContext.Provider
      value={{
        color,
        setColor: (c) => setColorState(c ?? MEADOW_COLORS.cream),
      }}
    >
      {children}
    </MeadowContext.Provider>
  );
}

export function useMeadowColor() {
  return useContext(MeadowContext).color;
}

/* Op een pagina neerzetten waar de laatste sectie vóór de footer geen
   crème achtergrond heeft. Zet niets op het scherm, alleen de kleur. */
export function MeadowColor({ color }: { color: string }) {
  const { setColor } = useContext(MeadowContext);
  useEffect(() => {
    setColor(color);
    return () => setColor(null);
  }, [color, setColor]);
  return null;
}
