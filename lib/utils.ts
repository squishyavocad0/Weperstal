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
