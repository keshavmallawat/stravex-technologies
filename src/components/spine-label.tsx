export function SpineLabel() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <span
        className="font-mono-label mix-blend-difference block whitespace-nowrap text-[11px] uppercase tracking-[0.3em] text-white/70"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Stravex — Indigenous Defence Systems
      </span>
    </div>
  );
}
