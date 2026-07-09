import { ReactNode } from "react";
import { Container } from "./container";

const toneClasses = {
  light: "bg-white text-ink",
  mist: "bg-mist text-ink",
  night: "bg-night text-white",
};

export function Section({
  children,
  tone = "light",
  className = "",
  containerClassName = "",
  id,
}: {
  children: ReactNode;
  tone?: keyof typeof toneClasses;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${toneClasses[tone]} py-20 md:py-28 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const alignClass = align === "center" ? "mx-auto text-center items-center" : "text-left";
  const descColor = tone === "dark" ? "text-night-muted" : "text-ink/65";
  const ruleColor = tone === "dark" ? "bg-night-border" : "bg-ink/15";

  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignClass}`}>
      {(index || eyebrow) && (
        <div className="flex items-center gap-3">
          {index && (
            <span className="font-mono-label text-xs text-brand">[ {index} ]</span>
          )}
          {index && eyebrow && <span className={`h-px w-6 ${ruleColor}`} />}
          {eyebrow && (
            <span className="font-mono-label text-xs uppercase text-brand">{eyebrow}</span>
          )}
        </div>
      )}
      <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className={`text-balance text-base leading-relaxed md:text-lg ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  );
}
