"use client";

import { motion, useReducedMotion } from "framer-motion";

export type MotifVariant =
  | "agnistrike"
  | "fpv-drones"
  | "flight-controller-esc"
  | "rakshakh"
  | "rudra";

function AgniStrikeMotif({ reduced }: { reduced: boolean | null }) {
  return (
    <svg viewBox="0 0 900 900" className="absolute right-[-10%] top-1/2 h-[720px] w-[720px] -translate-y-1/2 opacity-70 md:right-[2%]">
      {[120, 220, 320].map((r) => (
        <circle key={r} cx="450" cy="450" r={r} fill="none" stroke="var(--color-night-border)" strokeWidth="1" />
      ))}
      <line x1="450" y1="60" x2="450" y2="840" stroke="var(--color-night-border)" strokeWidth="1" />
      <line x1="60" y1="450" x2="840" y2="450" stroke="var(--color-night-border)" strokeWidth="1" />
      {!reduced && (
        <motion.circle
          cx="450"
          cy="450"
          r="320"
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth="1.5"
          strokeDasharray="4 10"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "450px 450px" }}
        />
      )}
      <circle cx="450" cy="450" r="6" fill="var(--color-brand)" />
    </svg>
  );
}

function FpvDronesMotif() {
  const modules = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 0],
  ];
  return (
    <svg viewBox="0 0 900 900" className="absolute right-[-6%] top-1/2 h-[640px] w-[640px] -translate-y-1/2 opacity-70">
      {modules.map(([x, y], i) => (
        <rect
          key={i}
          x={300 + x * 140}
          y={280 + y * 140}
          width="120"
          height="120"
          fill="none"
          stroke={i === 3 ? "var(--color-brand)" : "var(--color-night-border)"}
          strokeWidth="1.5"
        />
      ))}
      <line x1="360" y1="340" x2="360" y2="620" stroke="var(--color-night-border)" strokeWidth="1" />
      <line x1="500" y1="340" x2="500" y2="620" stroke="var(--color-night-border)" strokeWidth="1" />
    </svg>
  );
}

function FlightControllerMotif() {
  return (
    <svg viewBox="0 0 900 900" className="absolute right-[-8%] top-1/2 h-[680px] w-[680px] -translate-y-1/2 opacity-70">
      <rect x="360" y="360" width="180" height="180" fill="none" stroke="var(--color-brand)" strokeWidth="1.5" />
      {[420, 480].map((y) => (
        <line key={y} x1="180" y1={y} x2="360" y2={y} stroke="var(--color-night-border)" strokeWidth="1" />
      ))}
      {[420, 480].map((y) => (
        <line key={`r-${y}`} x1="540" y1={y} x2="720" y2={y} stroke="var(--color-night-border)" strokeWidth="1" />
      ))}
      {[420, 480].map((x) => (
        <line key={`t-${x}`} x1={x} y1="180" x2={x} y2="360" stroke="var(--color-night-border)" strokeWidth="1" />
      ))}
      {[420, 480].map((x) => (
        <line key={`b-${x}`} x1={x} y1="540" x2={x} y2="720" stroke="var(--color-night-border)" strokeWidth="1" />
      ))}
      {[180, 720].map((x) =>
        [420, 480].map((y) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--color-night-border)" />
        ))
      )}
    </svg>
  );
}

function RakshakhMotif() {
  return (
    <svg viewBox="0 0 900 900" className="absolute right-[-8%] top-1/2 h-[600px] w-[720px] -translate-y-1/2 opacity-70">
      <rect x="220" y="330" width="220" height="240" rx="24" fill="none" stroke="var(--color-night-border)" strokeWidth="1.5" />
      <rect x="460" y="330" width="220" height="240" rx="24" fill="none" stroke="var(--color-brand)" strokeWidth="1.5" />
      {[380, 420, 460, 500, 540].map((y) => (
        <line key={y} x1="460" y1={y} x2="680" y2={y} stroke="var(--color-night-border)" strokeWidth="0.75" />
      ))}
      <circle cx="330" cy="450" r="46" fill="none" stroke="var(--color-night-border)" strokeWidth="1" />
    </svg>
  );
}

function RudraMotif() {
  return (
    <svg viewBox="0 0 900 900" className="absolute right-[-6%] top-1/2 h-[560px] w-[720px] -translate-y-1/2 opacity-70">
      <line x1="140" y1="560" x2="780" y2="560" stroke="var(--color-night-border)" strokeWidth="1.5" />
      {[220, 340, 460, 580, 700].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 40}
            y={460}
            width="80"
            height="100"
            fill="none"
            stroke={i === 2 ? "var(--color-brand)" : "var(--color-night-border)"}
            strokeWidth="1.25"
          />
          <line x1={x} y1="460" x2={x} y2="380" stroke="var(--color-night-border)" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

export function MotifBackdrop({ variant }: { variant: MotifVariant }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_70%_50%,black,transparent)]" />
      {variant === "agnistrike" && <AgniStrikeMotif reduced={shouldReduceMotion} />}
      {variant === "fpv-drones" && <FpvDronesMotif />}
      {variant === "flight-controller-esc" && <FlightControllerMotif />}
      {variant === "rakshakh" && <RakshakhMotif />}
      {variant === "rudra" && <RudraMotif />}
      <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
    </div>
  );
}
