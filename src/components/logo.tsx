import Image from "next/image";

const LOGO_SRC = {
  light: "/brand/stravex-logo.jpg",
  dark: "/brand/stravex-logo-dark.png",
} as const;

/**
 * Official Stravex wordmark. Renders the light-background or dark-background
 * asset unmodified — sized via a fixed-height, generously-wide box with
 * object-contain so the real aspect ratio is always preserved (no stretching)
 * regardless of the source file's exact pixel dimensions.
 *
 * The dark asset's canvas carries more internal clear-space than the light
 * asset (~45% vs ~12% empty vertically), so its box is sized taller to give
 * the actual wordmark equal visual weight — this calibrates to the artwork,
 * not the canvas, per asset. If either file is replaced, re-check this ratio.
 */
export function Logo({
  dark = false,
  className = "",
  lightSrc,
  darkSrc,
}: {
  dark?: boolean;
  className?: string;
  /** Optional Settings-driven overrides; fall back to the real bundled assets when unset. */
  lightSrc?: string | null;
  darkSrc?: string | null;
}) {
  const boxSize = dark
    ? "h-14 w-56 md:h-16 md:w-64"
    : "h-9 w-40 md:h-10 md:w-44";

  const src = dark ? darkSrc || LOGO_SRC.dark : lightSrc || LOGO_SRC.light;

  return (
    <span className={`relative inline-block ${boxSize} ${className}`}>
      <Image
        src={src}
        alt="Stravex Technologies"
        fill
        priority
        sizes="260px"
        className="object-contain object-left"
      />
    </span>
  );
}
