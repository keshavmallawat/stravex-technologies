"use client";

import { useState, useTransition } from "react";
import { CaretDown, CaretUp, FloppyDisk } from "@phosphor-icons/react";
import { updatePageSeoAction, type PageSeoUpdateValues } from "@/app/admin/(dashboard)/seo/actions";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";
import { TagListEditor } from "@/components/admin/products/field-editors";

export function PageSeoCard({
  pageKey,
  label,
  initialValues,
}: {
  pageKey: string;
  label: string;
  initialValues: PageSeoUpdateValues;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof PageSeoUpdateValues>(key: K, value: PageSeoUpdateValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await updatePageSeoAction(pageKey, values);
      setSaved(true);
    });
  }

  const hasOverride = Boolean(values.title || values.metaDescription);

  return (
    <div className="border border-ink/10 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-ink">{label}</span>
          {hasOverride && (
            <span className="font-mono-label border border-emerald-600/40 px-2 py-0.5 text-[9px] uppercase text-emerald-700">
              Customized
            </span>
          )}
        </div>
        {open ? <CaretUp size={16} className="text-ink/40" /> : <CaretDown size={16} className="text-ink/40" />}
      </button>

      {open && (
        <div className="border-t border-ink/10 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="font-mono-label block text-[10px] uppercase text-ink/40">
                [ SEO Title ]
              </label>
              <input
                type="text"
                value={values.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Leave blank to use the page's default title"
                className="mt-1.5 w-full border border-ink/15 px-3 py-2 text-sm placeholder:text-ink/35"
              />
            </div>
            <div>
              <label className="font-mono-label block text-[10px] uppercase text-ink/40">
                [ Canonical URL ]
              </label>
              <input
                type="text"
                value={values.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
                className="mt-1.5 w-full border border-ink/15 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="font-mono-label block text-[10px] uppercase text-ink/40">
              [ Meta Description ]
            </label>
            <textarea
              value={values.metaDescription}
              onChange={(e) => set("metaDescription", e.target.value)}
              rows={2}
              placeholder="Leave blank to use the page's default description"
              className="mt-1.5 w-full border border-ink/15 px-3 py-2 text-sm placeholder:text-ink/35"
            />
          </div>
          <div className="mt-4">
            <MediaPickerField
              label="OG Image"
              category="og-image"
              value={values.ogImageUrl}
              onChange={(v) => set("ogImageUrl", v)}
            />
          </div>
          <div className="mt-4">
            <TagListEditor
              label="Keywords"
              items={values.keywords}
              onChange={(v) => set("keywords", v)}
            />
          </div>
          <div className="mt-4">
            <label className="font-mono-label block text-[10px] uppercase text-ink/40">
              [ Robots ]
            </label>
            <select
              value={values.robots}
              onChange={(e) => set("robots", e.target.value)}
              className="mt-1.5 border border-ink/15 px-3 py-2 text-sm"
            >
              <option value="index,follow">Index, Follow</option>
              <option value="noindex,follow">No Index, Follow</option>
              <option value="index,nofollow">Index, No Follow</option>
              <option value="noindex,nofollow">No Index, No Follow</option>
            </select>
          </div>
          <div className="mt-5 flex items-center justify-end gap-3">
            {saved && <span className="text-xs text-emerald-600">Saved.</span>}
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-5 py-2 text-xs uppercase text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FloppyDisk size={14} />
              {isPending ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
