"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FloppyDisk, Plus, Trash } from "@phosphor-icons/react";
import type { SettingsFormValues } from "@/lib/settings-types";
import type { NavLinkEntry } from "@/lib/settings-data";
import { updateSettingsAction } from "@/app/admin/(dashboard)/settings/actions";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";
import { TagListEditor } from "@/components/admin/products/field-editors";

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

function NavLinksEditor({
  items,
  onChange,
}: {
  items: NavLinkEntry[];
  onChange: (items: NavLinkEntry[]) => void;
}) {
  function update(index: number, patch: Partial<NavLinkEntry>) {
    onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ Navigation Links ]
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
              value={item.href}
              onChange={(e) => update(i, { href: e.target.value })}
              placeholder="/path"
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
        onClick={() => onChange([...items, { label: "", href: "" }])}
        className="font-mono-label mt-2 flex cursor-pointer items-center gap-1.5 border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
      >
        <Plus size={12} /> Add Link
      </button>
    </div>
  );
}

export function SettingsForm({ initialValues }: { initialValues: SettingsFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<SettingsFormValues>(initialValues);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof SettingsFormValues>(key: K, value: SettingsFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    startTransition(async () => {
      const result = await updateSettingsAction(values);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono-label text-[10px] uppercase text-ink/40">[ Settings ]</span>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Site Settings</h2>
        </div>
        <div className="flex items-center gap-4">
          {saved && <span className="text-xs text-emerald-600">Saved.</span>}
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>

      <Section title="Company Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Company Name">
            <input
              type="text"
              value={values.companyName}
              onChange={(e) => set("companyName", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Footer Tagline">
            <input
              type="text"
              value={values.footerTagline}
              onChange={(e) => set("footerTagline", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <TagListEditor
          label="Address Lines"
          items={values.addressLines}
          onChange={(v) => set("addressLines", v)}
        />
      </Section>

      <Section title="Contact Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Email">
            <input
              type="email"
              value={values.email}
              onChange={(e) => set("email", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Phone (display)">
            <input
              type="text"
              value={values.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Phone (tel: link)">
            <input
              type="text"
              value={values.phoneHref}
              onChange={(e) => set("phoneHref", e.target.value)}
              placeholder="tel:+91..."
              className={inputClass}
            />
          </Field>
          <Field label="Business Hours — Days">
            <input
              type="text"
              value={values.businessHoursDays}
              onChange={(e) => set("businessHoursDays", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Business Hours — Time">
            <input
              type="text"
              value={values.businessHoursTime}
              onChange={(e) => set("businessHoursTime", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Social Media Links">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="LinkedIn">
            <input
              type="text"
              value={values.socialLinkedin}
              onChange={(e) => set("socialLinkedin", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Instagram">
            <input
              type="text"
              value={values.socialInstagram}
              onChange={(e) => set("socialInstagram", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Twitter / X">
            <input
              type="text"
              value={values.socialTwitter}
              onChange={(e) => set("socialTwitter", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Facebook">
            <input
              type="text"
              value={values.socialFacebook}
              onChange={(e) => set("socialFacebook", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="YouTube">
            <input
              type="text"
              value={values.socialYoutube}
              onChange={(e) => set("socialYoutube", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Navigation & Footer">
        <NavLinksEditor items={values.navLinks} onChange={(v) => set("navLinks", v)} />
      </Section>

      <Section title="Branding">
        <MediaPickerField
          label="Light Logo (for light backgrounds)"
          category="site-logo"
          value={values.logoLightUrl}
          onChange={(v) => set("logoLightUrl", v)}
        />
        <MediaPickerField
          label="Dark Logo (for dark backgrounds)"
          category="site-logo"
          value={values.logoDarkUrl}
          onChange={(v) => set("logoDarkUrl", v)}
        />
        <MediaPickerField
          label="Favicon"
          category="favicon"
          value={values.faviconUrl}
          onChange={(v) => set("faviconUrl", v)}
        />
        <p className="text-xs text-ink/45">
          Leave blank to keep using the official bundled Stravex logo assets.
        </p>
      </Section>

      <Section title="SEO & Open Graph Defaults">
        <Field label="Default SEO Title">
          <input
            type="text"
            value={values.seoDefaultTitle}
            onChange={(e) => set("seoDefaultTitle", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Default SEO Description">
          <textarea
            value={values.seoDefaultDescription}
            onChange={(e) => set("seoDefaultDescription", e.target.value)}
            rows={2}
            className={inputClass}
          />
        </Field>
        <MediaPickerField
          label="Default OG Image"
          category="og-image"
          value={values.ogDefaultImageUrl}
          onChange={(v) => set("ogDefaultImageUrl", v)}
        />
      </Section>

      <Section title="Analytics">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="GA4 Measurement ID">
            <input
              type="text"
              value={values.analyticsGa4}
              onChange={(e) => set("analyticsGa4", e.target.value)}
              placeholder="G-XXXXXXX"
              className={inputClass}
            />
          </Field>
          <Field label="GTM Container ID">
            <input
              type="text"
              value={values.analyticsGtm}
              onChange={(e) => set("analyticsGtm", e.target.value)}
              placeholder="GTM-XXXXXXX"
              className={inputClass}
            />
          </Field>
          <Field label="Meta Pixel ID">
            <input
              type="text"
              value={values.analyticsMetaPixel}
              onChange={(e) => set("analyticsMetaPixel", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <p className="text-xs text-ink/45">
          IDs are stored for future wiring — analytics scripts are not yet injected into the site.
        </p>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 px-6 py-4 backdrop-blur lg:pl-64">
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-6 py-2.5 text-xs uppercase text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FloppyDisk size={15} />
            {isPending ? "Saving…" : "Save Settings"}
          </button>
        </div>
      </div>
    </form>
  );
}
