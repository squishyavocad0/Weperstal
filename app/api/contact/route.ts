import { NextResponse } from "next/server";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (
    !body ||
    typeof body.name !== "string" ||
    typeof body.email !== "string" ||
    typeof body.message !== "string" ||
    body.name.trim().length === 0 ||
    body.message.trim().length === 0 ||
    !/^\S+@\S+\.\S+$/.test(body.email)
  ) {
    return NextResponse.json(
      { error: "Vul naam, e-mailadres en bericht in." },
      { status: 400 }
    );
  }

  if (supabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: body.name.trim().slice(0, 200),
      email: body.email.trim().slice(0, 200),
      phone: typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : null,
      subject:
        typeof body.subject === "string"
          ? body.subject.trim().slice(0, 200)
          : "Contactformulier",
      message: body.message.trim().slice(0, 5000),
    });
    if (error) {
      return NextResponse.json(
        { error: "Opslaan mislukt, probeer het later opnieuw." },
        { status: 500 }
      );
    }
  }
  // Zonder database: formulier werkt in voorbeeldmodus gewoon door.

  return NextResponse.json({ ok: true });
}
