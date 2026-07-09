import { WorkflowStage } from "@/lib/product-types";
import { RevealGroup, RevealItem } from "@/components/reveal";

export function Workflow({ stages }: { stages: WorkflowStage[] }) {
  return (
    <RevealGroup className="grid grid-cols-1 gap-0 md:grid-cols-2 lg:grid-cols-3">
      {stages.map((stage, i) => (
        <RevealItem key={stage.stage}>
          <div className="relative border-t border-ink/10 py-6 pr-6 md:border-l md:border-t-0 md:pl-6 md:pt-0 md:first:border-l-0 md:first:pl-0">
            <span className="font-mono-label text-xs text-brand">
              [ {String(i + 1).padStart(2, "0")} ]
            </span>
            <h3 className="mt-3 text-lg font-semibold text-ink">{stage.stage}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/60">
              {stage.description}
            </p>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
