import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

/* Stuurt een notificatiemail bij een nieuw contactbericht, zodat er
   niets ongezien in het beheer blijft liggen. Werkt alleen als de
   SMTP-omgevingsvariabelen zijn ingesteld; anders wordt het bericht
   gewoon opgeslagen, net als voorheen. Mailfouten breken het
   formulier nooit: het bericht staat dan al veilig in de database. */
async function notifyByEmail(msg: {
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_NOTIFY_TO } =
    process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_NOTIFY_TO) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: Number(SMTP_PORT ?? 465) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"De Weperstal website" <${SMTP_USER}>`,
    to: CONTACT_NOTIFY_TO,
    replyTo: `"${msg.name.replace(/["\n\r]/g, "")}" <${msg.email}>`,
    subject: `Nieuw bericht via de website: ${msg.subject}`,
    text: [
      `Er is een nieuw bericht binnengekomen via weperstal.nl.`,
      ``,
      `Van:       ${msg.name}`,
      `E-mail:    ${msg.email}`,
      `Telefoon:  ${msg.phone || "—"}`,
      `Onderwerp: ${msg.subject}`,
      ``,
      msg.message,
      ``,
      `———`,
      `Beantwoorden kan direct: druk op "beantwoorden" en je mailt ${msg.name}.`,
      `Alle berichten staan ook in het beheer: https://weperstal.nl/admin/berichten`,
    ].join("\n"),
  });
}

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

  const msg = {
    name: body.name.trim().slice(0, 200),
    email: body.email.trim().slice(0, 200),
    phone:
      typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : null,
    subject:
      typeof body.subject === "string"
        ? body.subject.trim().slice(0, 200)
        : "Contactformulier",
    message: body.message.trim().slice(0, 5000),
  };

  if (supabaseConfigured()) {
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert(msg);
    if (error) {
      return NextResponse.json(
        { error: "Opslaan mislukt, probeer het later opnieuw." },
        { status: 500 }
      );
    }
  }
  // Zonder database: formulier werkt in voorbeeldmodus gewoon door.

  try {
    await notifyByEmail(msg);
  } catch (e) {
    // Bericht is al opgeslagen; alleen de notificatie faalde.
    console.error("Contactnotificatie versturen mislukt:", e);
  }

  return NextResponse.json({ ok: true });
}
