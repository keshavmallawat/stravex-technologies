"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, FloppyDisk, X } from "@phosphor-icons/react";
import {
  BLOCK_TYPES,
  BLOCK_TYPE_LABELS,
  type BlockType,
  type BlockContent,
  type ProductContentBlockValues,
  type HeroBlockContent,
  type TextBlockContent,
  type TwoColumnBlockContent,
  type GalleryBlockContent,
  type VideoBlockContent,
  type PosterBlockContent,
  type TimelineBlockContent,
  type WorkflowBlockContent,
  type SpecsTableBlockContent,
  type CtaBlockContent,
  type DownloadBlockContent,
  type FaqBlockContent,
} from "@/lib/product-block-types";
import {
  createProductBlockAction,
  updateProductBlockAction,
  deleteProductBlockAction,
  reorderProductBlockAction,
} from "@/app/admin/(dashboard)/products/blocks-actions";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";
import { GalleryEditor } from "@/components/admin/products/gallery-editor";
import { StageListEditor, SpecListEditor } from "@/components/admin/products/field-editors";

const inputClass =
  "w-full border border-ink/15 px-3 py-2 text-xs text-ink placeholder:text-ink/35";

export function BlockEditor({
  productId,
  initialBlocks,
}: {
  productId: string;
  initialBlocks: ProductContentBlockValues[];
}) {
  const router = useRouter();
  const [addType, setAddType] = useState<BlockType>("text");
  const [isPending, startTransition] = useTransition();

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div>
      <p className="text-xs text-ink/45">
        Optional page-builder blocks rendered below this product&apos;s fixed sections.
        Changes save independently of the form above.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {initialBlocks.map((block, i) => (
          <BlockCard
            key={block.id}
            block={block}
            isFirst={i === 0}
            isLast={i === initialBlocks.length - 1}
            onReorder={(direction) =>
              run(() => reorderProductBlockAction(block.id, productId, direction))
            }
            onDelete={() => run(() => deleteProductBlockAction(block.id, productId))}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <select
          value={addType}
          onChange={(e) => setAddType(e.target.value as BlockType)}
          className="cursor-pointer border border-ink/15 bg-white px-3 py-2 text-xs text-ink"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {BLOCK_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={isPending}
          onClick={() => run(() => createProductBlockAction(productId, addType))}
          className="font-mono-label flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand disabled:opacity-60"
        >
          <Plus size={12} /> Add Block
        </button>
      </div>
    </div>
  );
}

function BlockCard({
  block,
  isFirst,
  isLast,
  onReorder,
  onDelete,
}: {
  block: ProductContentBlockValues;
  isFirst: boolean;
  isLast: boolean;
  onReorder: (direction: "up" | "down") => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const [content, setContent] = useState<BlockContent>(block.content);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      await updateProductBlockAction(block.id, content);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <div className="border border-ink/10 bg-mist/40 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono-label text-[10px] uppercase text-brand">
          [ {BLOCK_TYPE_LABELS[block.type]} ]
        </span>
        <div className="flex items-center gap-1.5">
          {saved && <span className="text-[10px] text-emerald-600">Saved</span>}
          <button
            type="button"
            disabled={isFirst}
            onClick={() => onReorder("up")}
            className="cursor-pointer p-1 text-ink/45 hover:text-brand disabled:opacity-25"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            disabled={isLast}
            onClick={() => onReorder("down")}
            className="cursor-pointer p-1 text-ink/45 hover:text-brand disabled:opacity-25"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="cursor-pointer p-1 text-ink/45 hover:text-brand"
            title="Save block"
          >
            <FloppyDisk size={14} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="cursor-pointer p-1 text-ink/45 hover:text-red-500"
            title="Delete block"
          >
            <Trash size={14} />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <BlockFields type={block.type} content={content} onChange={setContent} />
      </div>

      {confirmDelete && (
        <div className="mt-3 flex items-center justify-between border border-red-200 bg-red-50 px-3 py-2">
          <span className="text-xs text-red-700">Delete this block?</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onDelete}
              className="font-mono-label cursor-pointer border border-red-500 bg-red-500 px-2.5 py-1 text-[10px] uppercase text-white"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="cursor-pointer p-1 text-ink/45 hover:text-ink"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

function BlockFields({
  type,
  content,
  onChange,
}: {
  type: BlockType;
  content: BlockContent;
  onChange: (content: BlockContent) => void;
}) {
  switch (type) {
    case "hero": {
      const c = content as HeroBlockContent;
      return (
        <div className="flex flex-col gap-3">
          <Field label="Heading">
            <input
              value={c.heading}
              onChange={(e) => onChange({ ...c, heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Subheading">
            <input
              value={c.subheading ?? ""}
              onChange={(e) => onChange({ ...c, subheading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <MediaPickerField
            label="Image"
            category="product-gallery"
            value={c.imageUrl ?? ""}
            onChange={(v) => onChange({ ...c, imageUrl: v })}
          />
        </div>
      );
    }
    case "text": {
      const c = content as TextBlockContent;
      return (
        <div className="flex flex-col gap-3">
          <Field label="Heading (optional)">
            <input
              value={c.heading ?? ""}
              onChange={(e) => onChange({ ...c, heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Body">
            <textarea
              value={c.body}
              onChange={(e) => onChange({ ...c, body: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>
      );
    }
    case "two-column": {
      const c = content as TwoColumnBlockContent;
      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label="Left Column">
            <textarea
              value={c.left}
              onChange={(e) => onChange({ ...c, left: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </Field>
          <Field label="Right Column">
            <textarea
              value={c.right}
              onChange={(e) => onChange({ ...c, right: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>
      );
    }
    case "gallery": {
      const c = content as GalleryBlockContent;
      return <GalleryEditor items={c.images} onChange={(images) => onChange({ images })} />;
    }
    case "video": {
      const c = content as VideoBlockContent;
      return (
        <div className="flex flex-col gap-3">
          <Field label="Video URL">
            <input
              value={c.url}
              onChange={(e) => onChange({ ...c, url: e.target.value })}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
          <Field label="Caption (optional)">
            <input
              value={c.caption ?? ""}
              onChange={(e) => onChange({ ...c, caption: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      );
    }
    case "poster": {
      const c = content as PosterBlockContent;
      return (
        <div className="flex flex-col gap-3">
          <MediaPickerField
            label="Image"
            category="product-gallery"
            value={c.imageUrl}
            onChange={(v) => onChange({ ...c, imageUrl: v })}
          />
          <Field label="Caption (optional)">
            <input
              value={c.caption ?? ""}
              onChange={(e) => onChange({ ...c, caption: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      );
    }
    case "timeline": {
      const c = content as TimelineBlockContent;
      return (
        <div className="flex flex-col gap-2">
          {c.items.map((item, i) => (
            <div key={i} className="flex gap-2 border border-ink/10 bg-white p-3">
              <div className="flex flex-1 flex-col gap-2">
                <input
                  value={item.date}
                  onChange={(e) => {
                    const items = [...c.items];
                    items[i] = { ...item, date: e.target.value };
                    onChange({ items });
                  }}
                  placeholder="Date"
                  className={inputClass}
                />
                <input
                  value={item.title}
                  onChange={(e) => {
                    const items = [...c.items];
                    items[i] = { ...item, title: e.target.value };
                    onChange({ items });
                  }}
                  placeholder="Title"
                  className={inputClass}
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const items = [...c.items];
                    items[i] = { ...item, description: e.target.value };
                    onChange({ items });
                  }}
                  placeholder="Description"
                  rows={2}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => onChange({ items: c.items.filter((_, idx) => idx !== i) })}
                className="h-fit cursor-pointer text-ink/40 hover:text-red-500"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ items: [...c.items, { date: "", title: "", description: "" }] })
            }
            className="font-mono-label flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
          >
            <Plus size={12} /> Add Entry
          </button>
        </div>
      );
    }
    case "workflow": {
      const c = content as WorkflowBlockContent;
      return <StageListEditor items={c.stages} onChange={(stages) => onChange({ stages })} />;
    }
    case "specs-table": {
      const c = content as SpecsTableBlockContent;
      return <SpecListEditor items={c.rows} onChange={(rows) => onChange({ rows })} />;
    }
    case "cta": {
      const c = content as CtaBlockContent;
      return (
        <div className="flex flex-col gap-3">
          <Field label="Heading">
            <input
              value={c.heading}
              onChange={(e) => onChange({ ...c, heading: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Body (optional)">
            <textarea
              value={c.body ?? ""}
              onChange={(e) => onChange({ ...c, body: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Button Label">
              <input
                value={c.buttonLabel}
                onChange={(e) => onChange({ ...c, buttonLabel: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Button URL">
              <input
                value={c.buttonHref}
                onChange={(e) => onChange({ ...c, buttonHref: e.target.value })}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      );
    }
    case "download": {
      const c = content as DownloadBlockContent;
      return (
        <div className="flex flex-col gap-3">
          <Field label="Label">
            <input
              value={c.label}
              onChange={(e) => onChange({ ...c, label: e.target.value })}
              placeholder="e.g. Download Datasheet"
              className={inputClass}
            />
          </Field>
          <MediaPickerField
            label="File"
            category="datasheet"
            value={c.fileUrl}
            onChange={(v) => onChange({ ...c, fileUrl: v })}
          />
        </div>
      );
    }
    case "faq": {
      const c = content as FaqBlockContent;
      return (
        <div className="flex flex-col gap-2">
          {c.items.map((item, i) => (
            <div key={i} className="flex gap-2 border border-ink/10 bg-white p-3">
              <div className="flex flex-1 flex-col gap-2">
                <input
                  value={item.question}
                  onChange={(e) => {
                    const items = [...c.items];
                    items[i] = { ...item, question: e.target.value };
                    onChange({ items });
                  }}
                  placeholder="Question"
                  className={inputClass}
                />
                <textarea
                  value={item.answer}
                  onChange={(e) => {
                    const items = [...c.items];
                    items[i] = { ...item, answer: e.target.value };
                    onChange({ items });
                  }}
                  placeholder="Answer"
                  rows={2}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => onChange({ items: c.items.filter((_, idx) => idx !== i) })}
                className="h-fit cursor-pointer text-ink/40 hover:text-red-500"
              >
                <Trash size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onChange({ items: [...c.items, { question: "", answer: "" }] })}
            className="font-mono-label flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
          >
            <Plus size={12} /> Add Question
          </button>
        </div>
      );
    }
  }
}
