"use client";

import { useEffect, useRef, useState } from "react";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.25) {
 const ref = useRef<HTMLDivElement>(null);
 const [inView, setInView] = useState(false);

 useEffect(() => {
  const observer = new IntersectionObserver(
   (entries) => {
    const entry = entries[0];
    if (entry?.isIntersecting) {
     setInView(true);
     observer.disconnect();
    }
   },
   { threshold },
  );
  if (ref.current) observer.observe(ref.current);
  return () => observer.disconnect();
 }, [threshold]);

 return { ref, inView };
}

// ─── Funnel ───────────────────────────────────────────────────────────────────

const FUNNEL_STAGES = [
 {
  label: "Currículos enviados",
  value: 1000,
  pct: null,
  fill: "#e4e4e7",
  text: "#3f3f46",
  sub: "#71717a",
 },
 {
  label: "Passam pelo ATS",
  value: 170,
  pct: "17%",
  fill: "#fecaca",
  text: "#991b1b",
  sub: "#dc2626",
 },
 {
  label: "Lidos por humanos",
  value: 34,
  pct: "3.4%",
  fill: "#fed7aa",
  text: "#9a3412",
  sub: "#ea580c",
 },
 {
  label: "Chamados para entrevista",
  value: 6,
  pct: "0.6%",
  fill: "#06b6d4",
  text: "#ffffff",
  sub: "#e0f9fd",
 },
];

function FunnelChart({ visible }: { visible: boolean }) {
 const W = 560;
 const H = 72;
 const GAP = 10;
 const total = FUNNEL_STAGES.length;
 const viewH = total * H + (total - 1) * GAP;
 const widths = [W, W * 0.64, W * 0.4, W * 0.22];

 const trapPath = (i: number) => {
  const tw = widths[i] ?? W;
  const bw =
   i < total - 1 ? (widths[i + 1] ?? W * 0.85) : (widths[i] ?? W) * 0.85;
  const y = i * (H + GAP);
  const r = 8;
  const top = y;
  const bot = y + H;
  const tx = (W - tw) / 2;
  const bx = (W - bw) / 2;

  return (
   `M ${tx + r},${top} ` +
   `L ${tx + tw - r},${top} ` +
   `Q ${tx + tw},${top} ${tx + tw},${top + r} ` +
   `L ${bx + bw},${bot - r} ` +
   `Q ${bx + bw},${bot} ${bx + bw - r},${bot} ` +
   `L ${bx + r},${bot} ` +
   `Q ${bx},${bot} ${bx},${bot - r} ` +
   `L ${tx},${top + r} ` +
   `Q ${tx},${top} ${tx + r},${top} Z`
  );
 };

 return (
  <svg
   viewBox={`0 0 ${W} ${viewH}`}
   className="mx-auto w-full max-w-lg"
   aria-label="Funil de candidaturas"
  >
   {FUNNEL_STAGES.map((stage, i) => {
    const y = i * (H + GAP);
    const delay = i * 130;

    return (
     <g key={stage.label}>
      <path
       d={trapPath(i)}
       fill={stage.fill}
       style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scaleY(1)" : "scaleY(0.4)",
        transformOrigin: `${W / 2}px ${y}px`,
        transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
       }}
      />
      <text
       x={W / 2}
       y={y + H / 2 - 9}
       textAnchor="middle"
       fill={stage.text}
       fontSize={22}
       fontWeight={800}
       fontFamily="system-ui, sans-serif"
       style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 0.35s ease ${delay + 220}ms`,
       }}
      >
       {stage.value.toLocaleString("pt-BR")}
      </text>
      <text
       x={W / 2}
       y={y + H / 2 + 12}
       textAnchor="middle"
       fill={stage.sub}
       fontSize={11}
       fontFamily="system-ui, sans-serif"
       style={{
        opacity: visible ? 1 : 0,
        transition: `opacity 0.35s ease ${delay + 320}ms`,
       }}
      >
       {stage.label}
       {stage.pct ? `  ·  ${stage.pct}` : ""}
      </text>
     </g>
    );
   })}
  </svg>
 );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function PainTimeSection() {
 const { ref: funnelRef, inView: funnelVisible } = useInView(0.15);

 return (
  <section className="bg-white px-6 py-24 md:py-32">
   <div className="mx-auto max-w-5xl">
    {/* ── Funnel ── */}
    <div
     ref={funnelRef}
     className="rounded-3xl border border-zinc-100 bg-zinc-50 p-8 md:p-12"
    >
     <div className="mb-8 text-center">
      <h3 className="text-2xl font-black uppercase tracking-tight text-zinc-900 md:text-3xl">
       O que acontece com cada currículo enviado
      </h3>
      <p className="mt-2 text-sm text-zinc-400">
       A cada 1.000 candidaturas enviadas no mercado
      </p>
     </div>

     <FunnelChart visible={funnelVisible} />

     <p className="mt-8 text-center text-xs text-zinc-400">
      Fontes: Jobscan, LinkedIn Talent Solutions, Harvard Business Review
     </p>
    </div>
   </div>
  </section>
 );
}

// ─── Closing Section ──────────────────────────────────────────────────────────

/**
 * Closing section - black bg, white text
 * Mirrors the HookSection style
 */
export function PainClosingSection() {
 return (
  <section className="relative bg-zinc-950 px-6 py-24">
   {/* Gradient line top */}
   <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

   <div className="mx-auto max-w-5xl text-center">
    <p className="text-lg text-zinc-500 md:text-xl">
     Você não está sendo rejeitado.
    </p>
    <h2 className="mt-4 text-3xl font-black text-white md:text-5xl uppercase">
     Você está sendo{" "}
     <span className="relative inline-block">
      <span className="relative z-10">filtrado por um robô</span>
      <span
       className="absolute inset-x-0 bottom-0.5 -z-0 h-2 bg-cyan-500/40 md:h-3"
       aria-hidden="true"
      />
     </span>
     .
    </h2>
   </div>

   {/* Gradient line bottom */}
   <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  </section>
 );
}
