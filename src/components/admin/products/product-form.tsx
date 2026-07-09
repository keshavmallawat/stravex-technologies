"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FloppyDisk, ArrowLeft, Eye } from "@phosphor-icons/react";
import {
  emptyProductForm,
  slugify,
  PRODUCT_STATUSES,
  type ProductFormValues,
} from "@/lib/product-types";
import {
  createProductAction,
  updateProductAction,
} from "@/app/admin/(dashboard)/products/actions";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";
import { GalleryEditor } from "@/components/admin/products/gallery-editor";
import {
  TagListEditor,
  StageListEditor,
  SpecListEditor,
  FeatureGroupsEditor,
} from "@/components/admin/products/field-editors";
import { BlockEditor } from "@/components/admin/products/block-editor";
import type { ProductContentBlockValues } from "@/lib/product-block-types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-ink/10 bg-white p-6">
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ {title} ]
      </span>
      <div className="mt-4 flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

export function ProductForm({
  productId,
  initialValues,
  otherProducts = [],
  initialBlocks = [],
}: {
  productId?: string;
  initialValues?: ProductFormValues;
  otherProducts?: { slug: string; name: string }[];
  initialBlocks?: ProductContentBlockValues[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? emptyProductForm
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      if (productId) {
        const result = await updateProductAction(productId, values);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        router.refresh();
      } else {
        const result = await createProductAction(values);
        if (result?.error) {
          setError(result.error);
        }
        // createProductAction redirects on success
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="font-mono-label flex cursor-pointer items-center gap-1.5 text-[10px] uppercase text-ink/50 hover:text-brand"
        >
          <ArrowLeft size={13} /> Back to Products
        </button>
        <div className="flex items-center gap-4">
          {productId && (
            <a
              href={`/admin/preview/products/${productId}`}
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
          <Field label="Product Name">
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => {
                const name = e.target.value;
                set("name", name);
                if (!slugTouched) set("slug", slugify(name));
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
              required
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Tactical Interception"
              className={inputClass}
            />
          </Field>
          <Field label="Public Status Badge">
            <input
              type="text"
              value={values.displayStatus}
              onChange={(e) => set("displayStatus", e.target.value)}
              placeholder="e.g. In Development"
              className={inputClass}
            />
          </Field>
          <Field label="CMS Status">
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value as ProductFormValues["status"])}
              className={inputClass}
            >
              {PRODUCT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hero Image Aspect Ratio">
            <input
              type="text"
              value={values.heroImageAspect}
              onChange={(e) => set("heroImageAspect", e.target.value)}
              placeholder="16 / 10"
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Feature this product
        </label>
      </Section>

      <Section title="Content">
        <Field label="Hero Title (optional override of the H1)">
          <input
            type="text"
            value={values.heroTitle}
            onChange={(e) => set("heroTitle", e.target.value)}
            placeholder="Defaults to the product name if left blank"
            className={inputClass}
          />
        </Field>
        <Field label="Tagline">
          <input
            type="text"
            value={values.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="e.g. Point. Analyze. Press. Protect."
            className={inputClass}
          />
        </Field>
        <Field label="Positioning">
          <input
            type="text"
            value={values.positioning}
            onChange={(e) => set("positioning", e.target.value)}
            placeholder="One-line positioning statement"
            className={inputClass}
          />
        </Field>
        <Field label="Purpose">
          <textarea
            value={values.purpose}
            onChange={(e) => set("purpose", e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Problem Statement">
          <textarea
            value={values.problemStatement}
            onChange={(e) => set("problemStatement", e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
        <Field label="Mission Profile / Extended Narrative">
          <textarea
            value={values.missionProfile}
            onChange={(e) => set("missionProfile", e.target.value)}
            rows={5}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Capabilities & Features">
        <TagListEditor
          label="Design Goals"
          items={values.designGoals}
          onChange={(v) => set("designGoals", v)}
        />
        <TagListEditor
          label="Core Capabilities"
          items={values.coreCapabilities}
          onChange={(v) => set("coreCapabilities", v)}
        />
        <TagListEditor
          label="Key Features"
          items={values.keyFeatures}
          onChange={(v) => set("keyFeatures", v)}
        />
        <TagListEditor
          label="Applications"
          items={values.applications}
          onChange={(v) => set("applications", v)}
        />
        <TagListEditor
          label="Related Technologies"
          items={values.relatedTechnologies}
          onChange={(v) => set("relatedTechnologies", v)}
        />
      </Section>

      <Section title="Workflow">
        <StageListEditor items={values.workflow} onChange={(v) => set("workflow", v)} />
      </Section>

      <Section title="Technical Specifications">
        <SpecListEditor
          items={values.technicalSpecs}
          onChange={(v) => set("technicalSpecs", v)}
        />
      </Section>

      <Section title="Additional Sections">
        <FeatureGroupsEditor
          items={values.extraFeatureLists}
          onChange={(v) => set("extraFeatureLists", v)}
        />
      </Section>

      <Section title="Media">
        <MediaPickerField
          label="Hero Poster"
          category="product-poster"
          value={values.heroPosterUrl}
          onChange={(v) => set("heroPosterUrl", v)}
        />
        <GalleryEditor items={values.galleryUrls} onChange={(v) => set("galleryUrls", v)} />
        <MediaPickerField
          label="Datasheet (PDF)"
          category="datasheet"
          value={values.datasheetUrl}
          onChange={(v) => set("datasheetUrl", v)}
        />
      </Section>

      <Section title="Call to Action">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="CTA Label">
            <input
              type="text"
              value={values.ctaLabel}
              onChange={(e) => set("ctaLabel", e.target.value)}
              placeholder="e.g. Request a Briefing"
              className={inputClass}
            />
          </Field>
          <Field label="CTA URL">
            <input
              type="text"
              value={values.ctaHref}
              onChange={(e) => set("ctaHref", e.target.value)}
              placeholder="/contact"
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Related Products">
        {otherProducts.length === 0 ? (
          <p className="text-sm text-ink/45">No other products exist yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {otherProducts.map((p) => {
              const checked = values.relatedProductSlugs.includes(p.slug);
              return (
                <label
                  key={p.slug}
                  className={`flex cursor-pointer items-center gap-2 border px-3 py-2 text-sm transition-colors ${
                    checked ? "border-brand bg-brand-soft text-ink" : "border-ink/15 text-ink/60"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) =>
                      set(
                        "relatedProductSlugs",
                        e.target.checked
                          ? [...values.relatedProductSlugs, p.slug]
                          : values.relatedProductSlugs.filter((s) => s !== p.slug)
                      )
                    }
                    className="h-3.5 w-3.5 cursor-pointer"
                  />
                  {p.name}
                </label>
              );
            })}
          </div>
        )}
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

      {productId && (
        <Section title="Page Builder">
          <BlockEditor productId={productId} initialBlocks={initialBlocks} />
        </Section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 px-6 py-4 backdrop-blur lg:pl-64">
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-6 py-2.5 text-xs uppercase text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FloppyDisk size={15} />
            {isPending ? "Saving…" : productId ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </div>
    </form>
  );
}
