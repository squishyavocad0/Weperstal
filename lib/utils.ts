export const speciesLabel: Record<string, string> = {
  paard: "Paard",
  pony: "Pony",
  hond: "Hond",
  kat: "Kat",
  schaap: "Schaap",
  kip: "Kip",
  vis: "Vis",
};

export const speciesPlural: Record<string, string> = {
  paard: "Paarden",
  pony: "Pony's",
  hond: "Honden",
  kat: "Katten",
  schaap: "Schapen",
  kip: "Kippen",
  vis: "Vissen",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Nette weergavenaam voor een beheerder: de zelfgekozen naam uit het
   account, anders het stuk vóór de @ van het e-mailadres. */
export function displayName(
  metadataName: unknown,
  email: string | undefined | null
) {
  const chosen = typeof metadataName === "string" ? metadataName.trim() : "";
  if (chosen) return chosen;
  const prefix = (email ?? "").split("@")[0].split(/[._+-]/)[0];
  if (!prefix) return null;
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}
