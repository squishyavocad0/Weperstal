import { NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.storyId !== "string") {
    return NextResponse.json({ error: "storyId ontbreekt" }, { status: 400 });
  }

  if (supabaseConfigured()) {
    const supabase = createClient();
    // Atomische verhoging via database-functie (zie schema.sql)
    const { error } = await supabase.rpc("increment_story_likes", {
      story_id: body.storyId,
    });
    if (error) {
      return NextResponse.json({ error: "Like opslaan mislukt" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
