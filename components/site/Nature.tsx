"use client";

import { useEffect, useRef } from "react";

/* ────────────────────────────────────────────────────────────────────────
   Het signatuur-element van De Weperstal: een organische weide-horizon
   met zacht wuivend gras, gebruikt als overgang tussen secties.
   ──────────────────────────────────────────────────────────────────────── */

export function MeadowDivider({
  from = "transparent",
  to = "#F9F5EC",
  flip = false,
}: {
  from?: string;
  to?: string;
  flip?: boolean;
}) {
  const blades = Array.from({ length: 26 }, (_, i) => {
    const x = 20 + i * 52 + ((i * 37) % 23);
    const h = 22 + ((i * 13) % 26);
    const delay = (i % 7) * 0.55;
    const dur = 3.8 + (i % 5) * 0.5;
    return { x, h, delay, dur, key: i };
  });

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative -mt-px h-24 w-full overflow-hidden md:h-32 ${
        flip ? "rotate-180" : ""
      }`}
      style={{ background: from }}
    >
      <svg
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* Achterste heuvel */}
        <path
          d="M0 92 C 240 58, 460 118, 740 84 C 1020 50, 1220 108, 1440 76 L1440 130 L0 130 Z"
          fill="#AFC8A3"
          opacity="0.45"
        />
        {/* Voorste heuvel */}
        <path
          d="M0 108 C 300 82, 560 126, 860 100 C 1140 76, 1300 118, 1440 98 L1440 130 L0 130 Z"
          fill={to}
        />
        {/* Wuivende grashalmen op de horizon */}
        {blades.map((b) => (
          <g key={b.key} transform={`translate(${b.x} ${104 - (b.key % 4) * 3})`}>
            <path
              className="grass-blade animate-sway"
              style={{
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.dur}s`,
              }}
              d={`M0 0 Q ${b.key % 2 ? 3 : -3} ${-b.h / 2} ${
                b.key % 2 ? 2 : -2
              } ${-b.h}`}
              stroke="#56724F"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              opacity={0.35 + (b.key % 4) * 0.12}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* Stofdeeltjes in zonlicht — canvas, licht en respecteert reduced motion */
export function SunlitDust({ count = 34 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = canvas.width = parent.clientWidth;
      h = canvas.height = parent.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const parts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.8,
      s: 0.08 + Math.random() * 0.22,
      p: Math.random() * Math.PI * 2,
      o: 0.15 + Math.random() * 0.4,
    }));

    const tick = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.s / h;
        p.x += Math.sin(t / 2400 + p.p) * 0.00035;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        const tw = 0.6 + 0.4 * Math.sin(t / 900 + p.p * 3);
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 245, 236, ${p.o * tw})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* Dwarrelend blaadje — heel spaarzaam gebruikt */
export function DriftingLeaves() {
  const leaves = [
    { left: "12%", delay: "0s", dur: "17s", scale: 0.8 },
    { left: "58%", delay: "6s", dur: "21s", scale: 1 },
    { left: "84%", delay: "11s", dur: "19s", scale: 0.7 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {leaves.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="animate-leaf-fall absolute -top-6 h-5 w-5 text-sage"
          style={{
            left: l.left,
            animationDelay: l.delay,
            animationDuration: l.dur,
            transform: `scale(${l.scale})`,
          }}
        >
          <path
            d="M12 2C7 7 4 12 4 16a8 8 0 0 0 16 0c0-4-3-9-8-14Zm0 18V9"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      ))}
    </div>
  );
}

/* Scroll-reveal wrapper */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
