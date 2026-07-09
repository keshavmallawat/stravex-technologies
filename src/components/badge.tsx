import { ReactNode } from "react";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber/40 bg-amber-soft px-3 py-1 font-mono-label text-[11px] uppercase text-amber">
      <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden />
      {status}
    </span>
  );
}

export function EyebrowBadge({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono-label inline-block text-[11px] uppercase text-brand">
      {children}
    </span>
  );
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-night-border/60 bg-night-elevated/40 px-4 py-3 text-sm text-night-muted">
      <span className="font-mono-label mr-2 text-[10px] uppercase text-night-muted/80">
        Placeholder
      </span>
      {children}
    </div>
  );
}

export function PlaceholderNoteLight({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/20 bg-mist px-4 py-3 text-sm text-ink/60">
      <span className="font-mono-label mr-2 text-[10px] uppercase text-ink/40">
        Placeholder
      </span>
      {children}
    </div>
  );
}
