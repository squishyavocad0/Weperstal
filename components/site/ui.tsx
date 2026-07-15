import Image from "next/image";
import Link from "next/link";
import type { Activity, Story, TeamMember } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-bark">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl leading-tight text-forest-deep md:text-4xl">
        {title}
      </h2>
      {text && <p className="mt-4 leading-relaxed text-ink/70">{text}</p>}
    </div>
  );
}

export function ActivityIcon({
  icon,
  className = "h-6 w-6",
}: {
  icon: Activity["icon"];
  className?: string;
}) {
  const paths: Record<Activity["icon"], React.ReactNode> = {
    hoof: (
      <path
        d="M12 3c-4.5 0-8 3.6-8 8.4 0 3 1.2 5.7 3 7.8l1.8-1.5C7.4 16 6.5 13.9 6.5 11.4 6.5 7.9 8.9 5.5 12 5.5s5.5 2.4 5.5 5.9c0 2.5-.9 4.6-2.3 6.3l1.8 1.5c1.8-2.1 3-4.8 3-7.8C20 6.6 16.5 3 12 3Zm-1 12h2v5h-2v-5Z"
        fill="currentColor"
      />
    ),
    saddle: (
      <path
        d="M4 8c2 2.5 4.5 3.5 8 3.5S18 10.5 20 8c.5 3-.5 6-3 7.5V19h-2v-2.6a12 12 0 0 1-6 0V19H7v-3.5C4.5 14 3.5 11 4 8Zm8-4c1.4 0 2.5 1 2.5 2.3 0 .4-.1.8-.3 1.2a11 11 0 0 1-4.4 0c-.2-.4-.3-.8-.3-1.2C9.5 5 10.6 4 12 4Z"
        fill="currentColor"
      />
    ),
    party: (
      <path
        d="M7 9 3.5 20.5 15 17 7 9Zm2.2 3.6 2.2 2.2-4.1 1.9 1.9-4.1ZM14 3l.9 2.4L17 6l-2.1.9L14 9l-.9-2.1L11 6l2.1-.6L14 3Zm5.5 5 .6 1.6 1.4.6-1.4.7-.6 1.6-.7-1.6-1.3-.7 1.3-.6.7-1.6ZM18 14l.7 1.8 1.8.7-1.8.8-.7 1.7-.7-1.7-1.8-.8 1.8-.7.7-1.8Z"
        fill="currentColor"
      />
    ),
    walk: (
      <path
        d="M13 4.5A1.8 1.8 0 1 1 13 8a1.8 1.8 0 0 1 0-3.5ZM9.6 21l1.7-5.2-2-1.5L8.5 17H6.4l1.2-4.4c.2-.8.8-1.4 1.5-1.7l3-1.2c.8-.3 1.7 0 2.2.6l1.2 1.5 2.5 1v2l-3.2-1.2-1.1-1.2-1 3.1 2.1 1.7-1 4.8h-2.1l.8-3.7-1.8-1.4-1 4.1H9.6Z"
        fill="currentColor"
      />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

export function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Link
      href={`/activiteiten/${activity.slug}`}
      className="group flex flex-col overflow-hidden rounded-organic bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lifted"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={activity.image_url}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream/90 text-forest shadow-soft backdrop-blur-sm">
          <ActivityIcon icon={activity.icon} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-display text-2xl text-forest-deep">
          {activity.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
          {activity.intro}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs text-forest">
          <span className="rounded-full bg-sage-whisper px-3 py-1">
            {activity.age_range}
          </span>
          <span className="rounded-full bg-sage-whisper px-3 py-1">
            {activity.duration}
          </span>
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest transition-colors group-hover:text-forest-deep">
          Lees meer
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <Link
      href={`/verhalen/${story.slug}`}
      className="group flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-organic bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lifted md:w-80"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={story.cover_url}
          alt={story.title}
          fill
          sizes="320px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs text-bark">{formatDate(story.published_at)}</p>
        <h3 className="mt-2 font-display text-xl leading-snug text-forest-deep">
          {story.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/70">
          {story.excerpt}
        </p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink/50">
          <HeartIcon className="h-4 w-4 text-bark" filled />
          {story.likes}
          <span aria-hidden="true">·</span>
          door {story.author}
        </p>
      </div>
    </Link>
  );
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="flex flex-col items-center rounded-organic bg-white p-8 text-center shadow-soft">
      <div className="relative h-36 w-36 overflow-hidden rounded-blob shadow-soft">
        <Image
          src={member.image_url}
          alt={`Portret van ${member.name}`}
          fill
          sizes="144px"
          className="object-cover"
        />
      </div>
      <h3 className="mt-6 font-display text-2xl text-forest-deep">
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-bark">{member.role}</p>
      <p className="mt-4 text-sm leading-relaxed text-ink/70">{member.bio}</p>
    </article>
  );
}

export function HeartIcon({
  className = "h-5 w-5",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 21s-7.5-4.7-10-9.3C.5 8 2.6 4.5 6.2 4.5c2 0 3.8 1.1 4.8 2.8a5.6 5.6 0 0 1 4.8-2.8c3.6 0 5.7 3.5 4.2 7.2C19.5 16.3 12 21 12 21Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.8}
      />
    </svg>
  );
}
