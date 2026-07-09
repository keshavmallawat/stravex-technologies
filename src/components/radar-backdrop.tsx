"use client";

import { motion, useReducedMotion } from "framer-motion";

export function RadarBackdrop() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      <div className="absolute left-1/2 top-0 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/3">
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-night-border"
            style={{
              inset: `${(ring - 1) * 15}%`,
            }}
          />
        ))}

        {!shouldReduceMotion && (
          <motion.div
            className="absolute inset-0 origin-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute left-1/2 top-1/2 h-1/2 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-brand/70 to-transparent" />
          </motion.div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night/20 to-night" />
    </div>
  );
}
