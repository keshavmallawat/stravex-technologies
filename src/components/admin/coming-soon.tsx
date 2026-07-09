import type { Icon } from "@phosphor-icons/react";

export function ComingSoon({
  icon: IconComponent,
  title,
  description,
}: {
  icon: Icon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center border border-dashed border-ink/15 bg-white px-6 py-20 text-center">
      <IconComponent size={32} weight="thin" className="text-ink/25" />
      <span className="font-mono-label mt-5 text-[11px] uppercase text-ink/40">
        [ Coming in a Future Phase ]
      </span>
      <h2 className="mt-3 text-xl font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/55">
        {description}
      </p>
    </div>
  );
}
