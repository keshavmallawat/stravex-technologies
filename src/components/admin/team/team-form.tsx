"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FloppyDisk, ArrowLeft } from "@phosphor-icons/react";
import {
  emptyTeamMemberForm,
  TEAM_MEMBER_STATUSES,
  type TeamMemberFormValues,
} from "@/lib/team-types";
import {
  createTeamMemberAction,
  updateTeamMemberAction,
} from "@/app/admin/(dashboard)/team/actions";
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

export function TeamMemberForm({
  memberId,
  initialValues,
}: {
  memberId?: string;
  initialValues?: TeamMemberFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<TeamMemberFormValues>(initialValues ?? emptyTeamMemberForm);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof TeamMemberFormValues>(key: K, value: TeamMemberFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      if (memberId) {
        const result = await updateTeamMemberAction(memberId, values);
        if (result?.error) {
          setError(result.error);
          return;
        }
        setSaved(true);
        router.refresh();
      } else {
        const result = await createTeamMemberAction(values);
        if (result?.error) setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/team")}
          className="font-mono-label flex cursor-pointer items-center gap-1.5 text-[10px] uppercase text-ink/50 hover:text-brand"
        >
          <ArrowLeft size={13} /> Back to Team
        </button>
        {saved && <span className="text-xs text-emerald-600">Saved.</span>}
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>

      <Section title="Profile">
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
          <Field label="Role / Title">
            <input
              type="text"
              required
              value={values.role}
              onChange={(e) => set("role", e.target.value)}
              placeholder="e.g. CEO & Co-founder"
              className={inputClass}
            />
          </Field>
          <Field label="Department">
            <input
              type="text"
              value={values.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="e.g. Leadership"
              className={inputClass}
            />
          </Field>
          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) => set("status", e.target.value as TeamMemberFormValues["status"])}
              className={inputClass}
            >
              {TEAM_MEMBER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Bio">
          <textarea
            value={values.bio}
            onChange={(e) => set("bio", e.target.value)}
            rows={4}
            className={inputClass}
          />
        </Field>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 cursor-pointer"
          />
          Feature this member
        </label>
      </Section>

      <Section title="Expertise">
        <TagListEditor
          label="Expertise Tags"
          items={values.expertiseTags}
          onChange={(v) => set("expertiseTags", v)}
        />
      </Section>

      <Section title="Photo">
        <MediaPickerField
          label="Portrait Photo"
          category="founder-photo"
          value={values.photoUrl}
          onChange={(v) => set("photoUrl", v)}
        />
      </Section>

      <Section title="Social Links">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="LinkedIn">
            <input
              type="text"
              value={values.socialLinkedin}
              onChange={(e) => set("socialLinkedin", e.target.value)}
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
          <Field label="Email">
            <input
              type="email"
              value={values.socialEmail}
              onChange={(e) => set("socialEmail", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/10 bg-white/95 px-6 py-4 backdrop-blur lg:pl-64">
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-6 py-2.5 text-xs uppercase text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FloppyDisk size={15} />
            {isPending ? "Saving…" : memberId ? "Save Changes" : "Create Member"}
          </button>
        </div>
      </div>
    </form>
  );
}
