"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, PencilSimple, Trash, FloppyDisk, X } from "@phosphor-icons/react";
import { slugify } from "@/lib/slug";
import type { TechSolutionStatus } from "@/lib/technology-types";

export interface TechSolutionRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  relatedSlugs: string[];
  status: string;
}

interface FormValues {
  name: string;
  slug: string;
  description: string;
  relatedSlugs: string[];
  status: TechSolutionStatus;
}

const emptyForm: FormValues = { name: "", slug: "", description: "", relatedSlugs: [], status: "draft" };

export function TechSolutionManager({
  label,
  relatedLabel,
  items,
  otherProducts,
  createAction,
  updateAction,
  setStatusAction,
  softDeleteAction,
}: {
  label: string;
  relatedLabel: string;
  items: TechSolutionRow[];
  otherProducts: { slug: string; name: string }[];
  createAction: (values: FormValues) => Promise<{ error?: string } | void>;
  updateAction: (id: string, values: FormValues) => Promise<{ error?: string } | void>;
  setStatusAction: (id: string, status: TechSolutionStatus) => Promise<unknown>;
  softDeleteAction: (id: string) => Promise<unknown>;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function startEdit(item: TechSolutionRow) {
    setEditingId(item.id);
    setAdding(false);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description,
      relatedSlugs: item.relatedSlugs,
      status: item.status as TechSolutionStatus,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditingId(null);
    setForm(emptyForm);
  }

  function cancel() {
    setAdding(false);
    setEditingId(null);
    setError(null);
  }

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const result = editingId ? await updateAction(editingId, form) : await createAction(form);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setAdding(false);
      setEditingId(null);
      router.refresh();
    });
  }

  function toggleRelated(slug: string) {
    setForm((f) => ({
      ...f,
      relatedSlugs: f.relatedSlugs.includes(slug)
        ? f.relatedSlugs.filter((s) => s !== slug)
        : [...f.relatedSlugs, slug],
    }));
  }

  const editForm = (
    <div className="border border-brand/30 bg-brand-soft p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono-label block text-[10px] uppercase text-ink/40">[ Name ]</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({ ...f, name, slug: editingId ? f.slug : slugify(name) }));
            }}
            className="mt-1.5 w-full border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="font-mono-label block text-[10px] uppercase text-ink/40">[ Slug ]</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
            className="mt-1.5 w-full border border-ink/15 px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="font-mono-label block text-[10px] uppercase text-ink/40">[ Description ]</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={2}
          className="mt-1.5 w-full border border-ink/15 px-3 py-2 text-sm"
        />
      </div>
      <div className="mt-4">
        <label className="font-mono-label block text-[10px] uppercase text-ink/40">
          [ {relatedLabel} ]
        </label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {otherProducts.map((p) => {
            const checked = form.relatedSlugs.includes(p.slug);
            return (
              <label
                key={p.slug}
                className={`flex cursor-pointer items-center gap-1.5 border px-2.5 py-1.5 text-xs ${
                  checked ? "border-brand bg-white text-ink" : "border-ink/15 text-ink/60"
                }`}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleRelated(p.slug)} className="h-3 w-3 cursor-pointer" />
                {p.name}
              </label>
            );
          })}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TechSolutionStatus }))}
          className="border border-ink/15 px-2 py-1.5 text-xs"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {error && <span className="text-xs text-red-600">{error}</span>}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="font-mono-label flex cursor-pointer items-center gap-1.5 border border-brand bg-brand px-4 py-2 text-[10px] uppercase text-white"
          >
            <FloppyDisk size={13} /> Save
          </button>
          <button
            type="button"
            onClick={cancel}
            className="font-mono-label cursor-pointer border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60"
          >
            <X size={13} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ink">{label}</h3>
        {!adding && (
          <button
            type="button"
            onClick={startAdd}
            className="font-mono-label flex cursor-pointer items-center gap-1.5 border border-brand bg-brand px-3 py-2 text-[10px] uppercase text-white hover:bg-brand-hover"
          >
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {adding && editForm}
        {items.length === 0 && !adding && (
          <p className="border border-ink/10 bg-white px-4 py-8 text-center text-sm text-ink/40">
            No entries yet.
          </p>
        )}
        {items.map((item) =>
          editingId === item.id ? (
            <div key={item.id}>{editForm}</div>
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between border border-ink/10 bg-white px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{item.name}</span>
                  <span className="font-mono-label border border-ink/20 px-1.5 py-0.5 text-[9px] uppercase text-ink/50">
                    {item.status}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-ink/45">{item.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <select
                  value={item.status}
                  onChange={(e) => run(() => setStatusAction(item.id, e.target.value as TechSolutionStatus))}
                  className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                >
                  <PencilSimple size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => run(() => softDeleteAction(item.id))}
                  className="cursor-pointer p-1.5 text-ink/45 hover:text-red-500"
                >
                  <Trash size={15} />
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
