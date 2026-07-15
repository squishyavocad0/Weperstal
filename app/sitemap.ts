import type { MetadataRoute } from "next";
import { getActivities, getStories } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://weperstal.nl";
  const [activities, stories] = await Promise.all([
    getActivities(),
    getStories(),
  ]);

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/over-ons`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/activiteiten`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/dieren`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/verhalen`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.7 },
    ...activities.map((a) => ({
      url: `${base}/activiteiten/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...stories.map((s) => ({
      url: `${base}/verhalen/${s.slug}`,
      lastModified: new Date(s.published_at),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
