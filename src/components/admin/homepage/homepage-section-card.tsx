"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowUp, ArrowDown, FloppyDisk, Eye, EyeSlash, Plus, Trash } from "@phosphor-icons/react";
import type { HomepageSectionData, HomepageItem } from "@/lib/homepage-data";
import {
  updateHomepageSectionAction,
  reorderHomepageSectionAction,
  type HomepageSectionUpdateValues,
} from "@/app/admin/(dashboard)/homepage/actions";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";
import { GalleryEditor } from "@/components/admin/products/gallery-editor";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  ecosystem: "Ecosystem (Featured Products)",
  "why-stravex": "Why Choose Stravex",
  mission: "Mission & Vision",
  capabilities: "Capabilities",
  press: "Press / In The News",
  cta: "Closing CTA",
};

const inputClass =
  "w-full border border-ink/15 px-3 py-2 text-sm text-ink placeholder:text-ink/35";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ {label} ]
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ItemsEditor({
  items,
  onChange,
}: {
  items: HomepageItem[];
  onChange: (items: HomepageItem[]) => void;
}) {
  function update(index: number, patch: Partial<HomepageItem>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ Items ]
      </label>
      <div className="mt-2 flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 border border-ink/10 p-2.5">
            <div className="flex flex-1 flex-col gap-1.5">
              <input
                type="text"
                value={item.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="Label"
                className="border border-ink/15 px-2 py-1.5 text-xs font-medium"
              />
              <textarea
                value={item.description}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Description"
                rows={2}
                className="border border-ink/15 px-2 py-1.5 text-xs"
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
        onClick={() => onChange([...items, { label: "", description: "" }])}
        className="font-mono-label mt-2 flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-1.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
      >
        <Plus size={12} /> Add Item
      </button>
    </div>
  );
}

export function HomepageSectionCard({
  section,
  isFirst,
  isLast,
}: {
  section: HomepageSectionData;
  isFirst: boolean;
  isLast: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<HomepageSectionUpdateValues>({
    heading: section.heading ?? "",
    body: section.body ?? "",
    eyebrow: section.eyebrow,
    items: section.items,
    missionText: section.missionText,
    visionText: section.visionText,
    badgeLabel: section.badgeLabel,
    badgeSubline: section.badgeSubline,
    ctaLabel: section.ctaLabel ?? "",
    ctaHref: section.ctaHref ?? "",
    secondaryCtaLabel: section.secondaryCtaLabel ?? "",
    secondaryCtaHref: section.secondaryCtaHref ?? "",
    imageUrl: section.imageUrl ?? "",
    mediaUrls: section.mediaUrls,
    enabled: section.enabled,
  });
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof HomepageSectionUpdateValues>(
    key: K,
    value: HomepageSectionUpdateValues[K]
  ) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updateHomepageSectionAction(section.key, values);
      setSaved(true);
      router.refresh();
    });
  }

  function reorder(direction: "up" | "down") {
    startTransition(async () => {
      await reorderHomepageSectionAction(section.key, direction);
      router.refresh();
    });
  }

  return (
    <div className={`border bg-white p-6 ${values.enabled ? "border-ink/10" : "border-dashed border-ink/20 opacity-70"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => reorder("up")}
              className="cursor-pointer text-ink/40 hover:text-brand disabled:opacity-25"
            >
              <ArrowUp size={13} />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => reorder("down")}
              className="cursor-pointer text-ink/40 hover:text-brand disabled:opacity-25"
            >
              <ArrowDown size={13} />
            </button>
          </div>
          <div>
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ {SECTION_LABELS[section.key] ?? section.key} ]
            </span>
            <p className="text-xs text-ink/40">Order: {section.sortOrder}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-xs text-emerald-600">Saved.</span>}
          <button
            type="button"
            onClick={() => set("enabled", !values.enabled)}
            className={`font-mono-label flex cursor-pointer items-center gap-1.5 border px-3 py-1.5 text-[10px] uppercase ${
              values.enabled ? "border-emerald-600/40 text-emerald-700" : "border-ink/20 text-ink/50"
            }`}
          >
            {values.enabled ? <Eye size={13} /> : <EyeSlash size={13} />}
            {values.enabled ? "Visible" : "Hidden"}
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Eyebrow">
          <input
            type="text"
            value={values.eyebrow}
            onChange={(e) => set("eyebrow", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Heading">
          <input
            type="text"
            value={values.heading}
            onChange={(e) => set("heading", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <Field label="Body">
          <textarea
            value={values.body}
            onChange={(e) => set("body", e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
      </div>

      {section.key === "hero" && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Status Badge Label">
            <input
              type="text"
              value={values.badgeLabel}
              onChange={(e) => set("badgeLabel", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Status Badge Subline">
            <input
              type="text"
              value={values.badgeSubline}
              onChange={(e) => set("badgeSubline", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {section.key === "mission" && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Mission Text">
            <textarea
              value={values.missionText}
              onChange={(e) => set("missionText", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>
          <Field label="Vision Text">
            <textarea
              value={values.visionText}
              onChange={(e) => set("visionText", e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {(section.key === "why-stravex" || section.key === "capabilities") && (
        <div className="mt-4">
          <ItemsEditor items={values.items} onChange={(v) => set("items", v)} />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Primary CTA Label">
          <input
            type="text"
            value={values.ctaLabel}
            onChange={(e) => set("ctaLabel", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Primary CTA URL">
          <input
            type="text"
            value={values.ctaHref}
            onChange={(e) => set("ctaHref", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Secondary CTA Label">
          <input
            type="text"
            value={values.secondaryCtaLabel}
            onChange={(e) => set("secondaryCtaLabel", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Secondary CTA URL">
          <input
            type="text"
            value={values.secondaryCtaHref}
            onChange={(e) => set("secondaryCtaHref", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-4">
        <MediaPickerField
          label="Background / Poster Image"
          category="other"
          value={values.imageUrl}
          onChange={(v) => set("imageUrl", v)}
        />
      </div>
      <div className="mt-4">
        <GalleryEditor items={values.mediaUrls} onChange={(v) => set("mediaUrls", v)} />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-5 py-2 text-xs uppercase text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FloppyDisk size={14} />
          {isPending ? "Saving…" : "Save Section"}
        </button>
      </div>
    </div>
  );
}
