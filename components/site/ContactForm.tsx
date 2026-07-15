"use client";

import { useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#56724F", "#AFC8A3", "#D6B76A", "#9B7B5D", "#F9F5EC"];
    const parts = Array.from({ length: 140 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 11,
      vy: -6 - Math.random() * 9,
      r: 4 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      c: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 2600);
        if (p.shape === "rect") ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.r / 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (elapsed < 2600) requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    requestAnimationFrame(tick);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      fireConfetti();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50"
        />
        <div
          className="animate-fade-up rounded-organic bg-white p-10 text-center shadow-lifted md:p-14"
          role="status"
        >
          <p className="text-6xl" aria-hidden="true">
            🐴
          </p>
          <h2 className="mt-6 font-display text-3xl text-forest-deep md:text-4xl">
            Tot snel!
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-ink/70">
            Bedankt voor je bericht. We nemen zo snel mogelijk contact met je
            op.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-50"
      />
      <form
        onSubmit={onSubmit}
        className="rounded-organic bg-white p-7 shadow-soft md:p-10"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink/80">
              Naam
            </label>
            <input
              id="name"
              name="name"
              required
              autoComplete="name"
              className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest"
              placeholder="Je naam"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink/80">
              E-mailadres
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest"
              placeholder="naam@voorbeeld.nl"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink/80">
              Telefoon <span className="text-ink/40">(optioneel)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest"
              placeholder="06 – …"
            />
          </div>
          <div>
            <label htmlFor="subject" className="mb-2 block text-sm font-medium text-ink/80">
              Onderwerp
            </label>
            <select
              id="subject"
              name="subject"
              className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest"
            >
              <option>Kennismaking plannen</option>
              <option>Vraag over activiteiten</option>
              <option>Kinderfeestje aanvragen</option>
              <option>Iets anders</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink/80">
            Bericht
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full rounded-2xl border border-sage-light bg-cream-soft px-4 py-3 outline-none transition-colors focus:border-forest"
            placeholder="Vertel gerust iets over je kind, jullie wensen of je vraag…"
          />
        </div>

        {status === "error" && (
          <p className="mt-4 rounded-2xl bg-gold-soft/40 px-4 py-3 text-sm text-bark-deep" role="alert">
            Het bericht kon niet worden verstuurd. Probeer het nog eens, of
            mail ons direct op hallo@weperstal.nl.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-8 w-full rounded-full bg-forest px-8 py-4 font-semibold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-lifted disabled:translate-y-0 disabled:opacity-60 md:w-auto"
        >
          {status === "sending" ? "Versturen…" : "Verstuur bericht"}
        </button>
      </form>
    </>
  );
}
