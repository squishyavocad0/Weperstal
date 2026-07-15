"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "./ui";

const STORAGE_KEY = "weperstal-likes";

function likedSet(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

export default function LikeButton({
  storyId,
  initialLikes,
}: {
  storyId: string;
  initialLikes: number;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    setLiked(likedSet().has(storyId));
  }, [storyId]);

  const onLike = async () => {
    if (liked) return;

    // Eén like per apparaat: onthoud in localStorage
    const set = likedSet();
    set.add(storyId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));

    setLiked(true);
    setLikes((n) => n + 1);
    setPop(true);
    setTimeout(() => setPop(false), 450);

    // Teller in de database ophogen (stil falen als er geen database is)
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storyId }),
      });
    } catch {
      /* voorbeeldmodus zonder database */
    }
  };

  return (
    <button
      onClick={onLike}
      disabled={liked}
      aria-pressed={liked}
      aria-label={
        liked
          ? `Je vindt dit verhaal leuk (${likes} likes)`
          : `Vind dit verhaal leuk (${likes} likes)`
      }
      className={`inline-flex items-center gap-2.5 rounded-full px-6 py-3 font-medium shadow-soft transition-all ${
        liked
          ? "bg-sage-whisper text-forest-deep"
          : "bg-white text-ink/70 hover:-translate-y-0.5 hover:text-forest-deep hover:shadow-lifted"
      }`}
    >
      <span className={pop ? "scale-125 transition-transform" : "transition-transform"}>
        <HeartIcon
          className={`h-5 w-5 ${liked ? "text-bark" : "text-bark/60"}`}
          filled={liked}
        />
      </span>
      <span>{likes}</span>
      <span className="text-sm text-ink/50">
        {liked ? "Bedankt!" : "Vind ik leuk"}
      </span>
    </button>
  );
}
