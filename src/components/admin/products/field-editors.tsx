"use client";

import { useState } from "react";
import { Plus, Trash, X } from "@phosphor-icons/react";
import type { WorkflowStage, TechnicalSpec, FeatureListSection } from "@/lib/product-types";

export function TagListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, value]);
    setDraft("");
  }

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ {label} ]
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1.5 border border-ink/15 bg-mist px-2.5 py-1 text-xs text-ink"
          >
            {item}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="cursor-pointer text-ink/40 hover:text-red-500"
            >
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder ?? "Add item and press Enter"}
          className="flex-1 border border-ink/15 px-3 py-2 text-xs text-ink placeholder:text-ink/35"
        />
        <button
          type="button"
          onClick={add}
          className="font-mono-label cursor-pointer border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
        >
          <Plus size={13} />
        </button>
      </div>
    </div>
  );
}

export function StageListEditor({
  items,
  onChange,
}: {
  items: WorkflowStage[];
  onChange: (items: WorkflowStage[]) => void;
}) {
  function update(index: number, patch: Partial<WorkflowStage>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ Workflow Stages ]
      </label>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 border border-ink/10 p-3">
            <div className="flex flex-1 flex-col gap-2">
              <input
                type="text"
                value={item.stage}
                onChange={(e) => update(i, { stage: e.target.value })}
                placeholder="Stage name"
                className="border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-ink placeholder:text-ink/35"
              />
              <textarea
                value={item.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="border border-ink/15 px-2.5 py-1.5 text-xs text-ink placeholder:text-ink/35"
              />
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="h-fit cursor-pointer text-ink/40 hover:text-red-500"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { stage: "", description: "" }])}
        className="font-mono-label mt-2 flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
      >
        <Plus size={12} /> Add Stage
      </button>
    </div>
  );
}

export function SpecListEditor({
  items,
  onChange,
}: {
  items: TechnicalSpec[];
  onChange: (items: TechnicalSpec[]) => void;
}) {
  function update(index: number, patch: Partial<TechnicalSpec>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ Technical Specs ]
      </label>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              value={item.label}
              onChange={(e) => update(i, { label: e.target.value })}
              placeholder="Label"
              className="w-1/3 border border-ink/15 px-2.5 py-1.5 text-xs text-ink placeholder:text-ink/35"
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) => update(i, { value: e.target.value })}
              placeholder="Value"
              className="flex-1 border border-ink/15 px-2.5 py-1.5 text-xs text-ink placeholder:text-ink/35"
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="cursor-pointer text-ink/40 hover:text-red-500"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { label: "", value: "" }])}
        className="font-mono-label mt-2 flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
      >
        <Plus size={12} /> Add Spec
      </button>
    </div>
  );
}

export function FeatureGroupsEditor({
  items,
  onChange,
}: {
  items: FeatureListSection[];
  onChange: (items: FeatureListSection[]) => void;
}) {
  function updateHeading(index: number, heading: string) {
    onChange(items.map((it, i) => (i === index ? { ...it, heading } : it)));
  }
  function updateItems(index: number, newItems: string[]) {
    onChange(items.map((it, i) => (i === index ? { ...it, items: newItems } : it)));
  }

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ Additional Feature Sections ]
      </label>
      <p className="mt-1 text-xs text-ink/45">
        For platform-specific content unique to this product (e.g. &ldquo;ESC Features&rdquo;, &ldquo;Available Platforms&rdquo;).
      </p>
      <div className="mt-2 flex flex-col gap-3">
        {items.map((section, i) => (
          <div key={i} className="border border-ink/10 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={section.heading}
                onChange={(e) => updateHeading(i, e.target.value)}
                placeholder="Section heading, e.g. ESC Features"
                className="flex-1 border border-ink/15 px-2.5 py-1.5 text-xs font-medium text-ink placeholder:text-ink/35"
              />
              <button
                type="button"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="cursor-pointer text-ink/40 hover:text-red-500"
              >
                <Trash size={14} />
              </button>
            </div>
            <div className="mt-2">
              <TagListEditor
                label="Items"
                items={section.items}
                onChange={(newItems) => updateItems(i, newItems)}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, { heading: "", items: [] }])}
        className="font-mono-label mt-2 flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
      >
        <Plus size={12} /> Add Section
      </button>
    </div>
  );
}
