export type AnimalSpecies =
  | "paard"
  | "pony"
  | "hond"
  | "kat"
  | "schaap"
  | "kip"
  | "vis";

export interface Animal {
  id: string;
  name: string;
  species: AnimalSpecies;
  age: number;
  bio: string;
  traits: string[];
  image_url: string;
  published: boolean;
  sort_order: number;
}

export interface Activity {
  id: string;
  slug: string;
  title: string;
  intro: string;
  description: string;
  highlights: string[];
  duration: string;
  age_range: string;
  group_size: string;
  price_hint: string;
  image_url: string;
  icon: "hoof" | "saddle" | "party" | "walk";
  published: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string;
  gallery: string[];
  author: string;
  published_at: string;
  published: boolean;
  likes: number;
  seo_title: string | null;
  seo_description: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  published: boolean;
  sort_order: number;
}

export interface SiteContent {
  key: string;
  value: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  handled: boolean;
}
