"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import {
  emptyPartnerForm,
  PARTNER_CATEGORIES,
  PARTNER_STATUSES,
  type PartnerFormValues,
} from "@/lib/partner-types";
import { createPartnerAction, updatePartnerAction } from "@/app/admin/(dashboard)/partners/actions";
import { MediaPickerField } from "@/components/admin/products/media-picker-field";

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

export function PartnerForm({
  partnerId,
  initialValues,
}: {
  partnerId?: string;
  initialValues?: PartnerFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<PartnerFormValues>(initialValues ?? emptyPartnerForm);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof PartnerFormValues>(key: K, value: PartnerFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      if (partnerId) {
        const result = await updatePartnerAction(partnerId, values);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        router.refresh();
      } else {
        const result = await createPartnerAction(values);
        if (result?.error) setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/partners")}
          className="font-mono-label flex cursor-pointer items-center gap-1.5 text-[10px] uppercase text-ink/50 hover:text-brand"
        >
          <ArrowLeft size={13} /> Back to Partners
        </button>
        {saved && <span className="text-xs text-emerald-600">Saved.</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>

      <Section title="Details">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input
              type="text"
              required
              value={values.name}
              onChange={(e) => set("name", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Website URL">
            <input
              type="text"
              value={values.websiteUrl}
              onChange={(e) => set("websiteUrl", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select
              value={values.category}
              onChange={(e) => set("category", e.target.value as PartnerFormValues["category"])}
              className={inputClass}
            >
              {PARTNER_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c[0].toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value as PartnerFormValues["status"])}
              className={inputClass}
            >
              {PARTNER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Description">
          <textarea
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            className={inputClass}
          />
        </Field>
      </Section>

      <Section title="Logo">
        <MediaPickerField
          label="Logo"
          category="incubator-logo"
          value={values.logoUrl}
          onChange={(v) => set("logoUrl", v)}
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
            {isPending ? "Saving…" : partnerId ? "Save Changes" : "Create Partner"}
          </button>
        </div>
      </div>
    </form>
  );
}
