"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import { slugify } from "@/lib/slug";
import {
  emptyJobOpeningForm,
  JOB_OPENING_STATUSES,
  WORK_MODES,
  type JobOpeningFormValues,
} from "@/lib/job-opening-types";
import {
  createJobOpeningAction,
  updateJobOpeningAction,
} from "@/app/admin/(dashboard)/careers/openings/actions";
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

export function JobOpeningForm({
  jobId,
  initialValues,
}: {
  jobId?: string;
  initialValues?: JobOpeningFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<JobOpeningFormValues>(initialValues ?? emptyJobOpeningForm);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues?.slug));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof JobOpeningFormValues>(key: K, value: JobOpeningFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      if (jobId) {
        const result = await updateJobOpeningAction(jobId, values);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        router.refresh();
      } else {
        const result = await createJobOpeningAction(values);
        if (result?.error) setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/careers")}
          className="font-mono-label flex cursor-pointer items-center gap-1.5 text-[10px] uppercase text-ink/50 hover:text-brand"
        >
          <ArrowLeft size={13} /> Back to Careers
        </button>
        {saved && <span className="text-xs text-emerald-600">Saved.</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>

      <Section title="Basic Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Job Title">
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
          <Field label="Department">
            <input
              type="text"
              required
              value={values.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="e.g. Engineering"
              className={inputClass}
            />
          </Field>
          <Field label="Employment Type">
            <input
              type="text"
              required
              value={values.employmentType}
              onChange={(e) => set("employmentType", e.target.value)}
              placeholder="e.g. Full-time"
              className={inputClass}
            />
          </Field>
          <Field label="Experience">
            <input
              type="text"
              value={values.experience}
              onChange={(e) => set("experience", e.target.value)}
              placeholder="e.g. 2-4 years"
              className={inputClass}
            />
          </Field>
          <Field label="Location">
            <input
              type="text"
              required
              value={values.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Navi Mumbai, India"
              className={inputClass}
            />
          </Field>
          <Field label="Work Mode">
            <select
              value={values.workMode}
              onChange={(e) => set("workMode", e.target.value as JobOpeningFormValues["workMode"])}
              className={inputClass}
            >
              {WORK_MODES.map((m) => (
                <option key={m} value={m}>
                  {m[0].toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Salary (optional)">
            <input
              type="text"
              value={values.salary}
              onChange={(e) => set("salary", e.target.value)}
              placeholder="e.g. As per industry standards"
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value as JobOpeningFormValues["status"])}
              className={inputClass}
            >
              {JOB_OPENING_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Expiry Date (optional)">
            <input
              type="date"
              value={values.expiryDate}
              onChange={(e) => set("expiryDate", e.target.value)}
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
          Feature this opening
        </label>
      </Section>

      <Section title="Role Details">
        <TagListEditor
          label="Responsibilities"
          items={values.responsibilities}
          onChange={(v) => set("responsibilities", v)}
        />
        <TagListEditor
          label="Requirements"
          items={values.requirements}
          onChange={(v) => set("requirements", v)}
        />
        <TagListEditor label="Skills" items={values.skills} onChange={(v) => set("skills", v)} />
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 px-6 py-4 backdrop-blur lg:pl-64">
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-6 py-2.5 text-xs uppercase text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FloppyDisk size={15} />
            {isPending ? "Saving…" : jobId ? "Save Changes" : "Create Job Opening"}
          </button>
        </div>
      </div>
    </form>
  );
}
