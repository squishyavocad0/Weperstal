import { createClient, supabaseConfigured } from "./supabase/server";
import {
  seedActivities,
  seedAnimals,
  seedContent,
  seedFaqs,
  seedStories,
  seedTeam,
} from "./seed";
import type { Activity, Animal, Faq, Story, TeamMember } from "./types";

// Alle publieke data loopt via deze laag. Is Supabase gekoppeld, dan komt
// de content uit de database; zo niet, dan uit de ingebouwde voorbeeldcontent.
// De site oogt daardoor altijd compleet.

async function fromTable<T>(
  table: string,
  fallback: T[],
  order: { column: string; ascending: boolean } = {
    column: "sort_order",
    ascending: true,
  }
): Promise<T[]> {
  if (!supabaseConfigured()) return fallback;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("published", true)
      .order(order.column, { ascending: order.ascending });
    if (error || !data || data.length === 0) return fallback;
    return data as T[];
  } catch {
    return fallback;
  }
}

export async function getAnimals(): Promise<Animal[]> {
  return fromTable<Animal>("animals", seedAnimals);
}

export async function getActivities(): Promise<Activity[]> {
  return fromTable<Activity>("activities", seedActivities);
}

export async function getActivity(slug: string): Promise<Activity | null> {
  const all = await getActivities();
  return all.find((a) => a.slug === slug) ?? null;
}

export async function getStories(): Promise<Story[]> {
  return fromTable<Story>("stories", seedStories, {
    column: "published_at",
    ascending: false,
  });
}

export async function getStory(slug: string): Promise<Story | null> {
  const all = await getStories();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  return fromTable<TeamMember>("team_members", seedTeam);
}

export async function getFaqs(): Promise<Faq[]> {
  return fromTable<Faq>("faqs", seedFaqs);
}

export async function getContent(): Promise<Record<string, string>> {
  if (!supabaseConfigured()) return seedContent;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("site_content").select("*");
    if (error || !data || data.length === 0) return seedContent;
    const merged = { ...seedContent };
    for (const row of data as { key: string; value: string }[]) {
      merged[row.key] = row.value;
    }
    return merged;
  } catch {
    return seedContent;
  }
}
