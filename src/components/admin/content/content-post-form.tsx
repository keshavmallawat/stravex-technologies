"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FloppyDisk, ArrowLeft, Eye } from "@phosphor-icons/react";
import { slugify } from "@/lib/slug";
import {
  emptyContentPostForm,
  CONTENT_STATUSES,
  type ContentPostFormValues,
} from "@/lib/content-post-types";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";
import { GalleryEditor } from "@/components/admin/products/gallery-editor";
import { TagListEditor } from "@/components/admin/products/field-editors";
import { RichTextEditor } from "@/components/admin/content/rich-text-editor";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-ink/10 bg-white p-6">
      <span className="font-mono-label text-[10px] uppercase text-ink/40">[ {title} ]</span>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ {label} ]
      </label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full border border-ink/15 px-3 py-2.5 text-sm text-ink placeholder:text-ink/35";

type ActionResult = { error?: string; success?: boolean } | void;

export function ContentPostForm({
  kind,
  postId,
  initialValues,
  createAction,
  updateAction,
  previewHref,
}: {
  kind: "blog" | "news";
  postId?: string;
  initialValues?: ContentPostFormValues;
  createAction: (values: ContentPostFormValues) => Promise<ActionResult>;
  updateAction: (id: string, values: ContentPostFormValues) => Promise<ActionResult>;
  previewHref?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ContentPostFormValues>(
    initialValues ?? emptyContentPostForm
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof ContentPostFormValues>(key: K, value: ContentPostFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      if (postId) {
        const result = await updateAction(postId, values);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        router.refresh();
      } else {
        const result = await createAction(values);
        if (result?.error) setError(result.error);
      }
    });
  }

  const backHref = kind === "blog" ? "/admin/blog" : "/admin/news";
  const mediaCategory = kind === "blog" ? "blog-image" : "news-image";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="font-mono-label flex cursor-pointer items-center gap-1.5 text-[10px] uppercase text-ink/50 hover:text-brand"
        >
          <ArrowLeft size={13} /> Back
        </button>
        <div className="flex items-center gap-4">
          {previewHref && (
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label flex cursor-pointer items-center gap-1.5 text-[10px] uppercase text-ink/50 hover:text-brand"
            >
              <Eye size={13} /> Preview
            </a>
          )}
          {saved && <span className="text-xs text-emerald-600">Saved.</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>

      <Section title="Basic Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Title">
            <input
              type="text"
              required
              value={values.title}
              onChange={(e) => {
                const title = e.target.value;
                set("title", title);
                if (!slugTouched) set("slug", slugify(title));
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Slug">
            <input
              type="text"
              required
              value={values.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <input
              type="text"
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value as ContentPostFormValues["status"])}
              className={inputClass}
            >
              {CONTENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={values.status === "scheduled" ? "Publish Date/Time (scheduled)" : "Published Date/Time"}>
            <input
              type="datetime-local"
              value={values.publishedAt}
              onChange={(e) => set("publishedAt", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <TagListEditor label="Tags" items={values.tags} onChange={(v) => set("tags", v)} />
      </Section>

      <Section title="Content">
        <Field label="Excerpt">
          <textarea
            value={values.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            placeholder="Short summary shown in listings"
            className={inputClass}
          />
        </Field>
        <Field label="Body">
          <RichTextEditor value={values.content} onChange={(html) => set("content", html)} />
        </Field>
      </Section>

      {kind === "news" && (
        <Section title="External Coverage (optional)">
          <p className="text-xs text-ink/45">
            Fill this in only if this is third-party press coverage, not an in-house article.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Outlet Name">
              <input
                type="text"
                value={values.outlet}
                onChange={(e) => set("outlet", e.target.value)}
                placeholder="e.g. Indian Defence News"
                className={inputClass}
              />
            </Field>
            <Field label="External URL">
              <input
                type="text"
                value={values.externalUrl}
                onChange={(e) => set("externalUrl", e.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
            </Field>
          </div>
        </Section>
      )}

      <Section title="Media">
        <MediaPickerField
          label="Featured Image"
          category={mediaCategory}
          value={values.featuredImageUrl}
          onChange={(v) => set("featuredImageUrl", v)}
        />
        <GalleryEditor items={values.galleryUrls} onChange={(v) => set("galleryUrls", v)} />
      </Section>

      <Section title="SEO">
        <Field label="SEO Title">
          <input
            type="text"
            value={values.seoTitle}
            onChange={(e) => set("seoTitle", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="SEO Description">
          <textarea
            value={values.seoDescription}
            onChange={(e) => set("seoDescription", e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
        <MediaPickerField
          label="OG Image"
          category="og-image"
          value={values.ogImageUrl}
          onChange={(v) => set("ogImageUrl", v)}
        />
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 px-6 py-4 backdrop-blur lg:pl-64">
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-6 py-2.5 text-xs uppercase text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FloppyDisk size={15} />
            {isPending ? "Saving…" : postId ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </form>
  );
}
