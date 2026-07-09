import Image from "next/image";
import { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { ImageSquare } from "@phosphor-icons/react/dist/ssr";

/**
 * Reserved space for a future real asset. Pass `src` once the final image
 * exists and this renders it directly — no layout change needed upstream.
 */
export function MediaFrame({
  aspect = "4 / 3",
  label = "Image",
  sublabel,
  icon: IconComponent = ImageSquare,
  tone = "dark",
  src,
  alt,
  className = "",
  children,
  bordered = true,
  sizes,
  priority,
  loading,
}: {
  aspect?: string;
  label?: string;
  sublabel?: string;
  icon?: Icon;
  tone?: "dark" | "light";
  src?: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
  bordered?: boolean;
  sizes?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
}) {
  if (src) {
    return (
      <div
        className={`relative w-full overflow-hidden ${className}`}
        style={{ aspectRatio: aspect }}
      >
        <Image
          src={src}
          alt={alt ?? label}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          loading={loading}
        />
      </div>
    );
  }

  const dark = tone === "dark";

  return (
    <div
      className={`group relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-8 text-center ${
        bordered ? "border" : ""
      } ${dark ? "border-night-border bg-night-elevated" : "border-ink/15 bg-mist"} ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <div className={`bg-grid absolute inset-0 ${dark ? "opacity-20" : "opacity-40"}`} aria-hidden />

      {[
        "top-4 left-4 border-l border-t",
        "top-4 right-4 border-r border-t",
        "bottom-4 left-4 border-l border-b",
        "bottom-4 right-4 border-r border-b",
      ].map((pos) => (
        <div
          key={pos}
          aria-hidden
          className={`absolute h-5 w-5 transition-colors duration-300 group-hover:border-brand/60 ${
            dark ? "border-night-border" : "border-ink/20"
          } ${pos}`}
        />
      ))}

      <div className="relative flex flex-col items-center">
        {children ?? (
          <>
            <IconComponent
              size={30}
              weight="thin"
              className={dark ? "text-white/25" : "text-ink/25"}
            />
            <span
              className={`font-mono-label mt-4 text-[10px] uppercase tracking-wide ${
                dark ? "text-night-muted" : "text-ink/40"
              }`}
            >
              [ {label} ]
            </span>
            {sublabel && (
              <span
                className={`font-mono-label mt-1 text-[9px] uppercase ${
                  dark ? "text-night-muted/60" : "text-ink/30"
                }`}
              >
                {sublabel}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
