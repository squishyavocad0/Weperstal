import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="text-6xl" aria-hidden="true">🐴</p>
      <h1 className="mt-6 font-display text-4xl text-forest-deep">
        Deze wei is leeg
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink/70">
        De pagina die je zoekt bestaat niet (meer). Misschien is er een pony
        met het bordje vandoor gegaan.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-forest px-8 py-4 font-semibold text-cream shadow-soft transition-all hover:-translate-y-0.5 hover:bg-forest-deep"
      >
        Terug naar huis
      </Link>
    </div>
  );
}
