"use client";

import { FormEvent, useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, UploadSimple } from "@phosphor-icons/react";

export function CareerApplicationForm({
  jobOpeningId,
  roleLabel,
}: {
  jobOpeningId?: string;
  roleLabel: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    if (jobOpeningId) formData.set("jobOpeningId", jobOpeningId);
    formData.set("appliedRole", roleLabel);

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setFileName(null);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border border-brand/30 bg-brand-soft px-6 py-12 text-center">
        <CheckCircle size={28} weight="fill" className="text-brand" />
        <p className="text-sm font-medium text-ink">Application submitted.</p>
        <p className="max-w-sm text-sm text-ink/60">
          Thanks for applying — the Stravex team reviews every application personally.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="applicantName" className="font-mono-label text-xs uppercase text-ink/50">
            Full Name <span className="text-brand">*</span>
          </label>
          <input
            id="applicantName"
            name="applicantName"
            type="text"
            required
            autoComplete="name"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="email" className="font-mono-label text-xs uppercase text-ink/50">
            Email Address <span className="text-brand">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="font-mono-label text-xs uppercase text-ink/50">
            Phone <span className="normal-case text-ink/30">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="company" className="font-mono-label text-xs uppercase text-ink/50">
            Current Company <span className="normal-case text-ink/30">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="font-mono-label text-xs uppercase text-ink/50">
          Message <span className="normal-case text-ink/30">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Anything you'd like us to know..."
          className="mt-2 w-full resize-none border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
        />
      </div>

      <div>
        <label className="font-mono-label text-xs uppercase text-ink/50">
          Resume <span className="text-brand">*</span>
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 flex w-full cursor-pointer items-center gap-2 border border-dashed border-ink/25 px-4 py-3 text-sm text-ink/60 hover:border-brand hover:text-brand"
        >
          <UploadSimple size={16} />
          {fileName ?? "Upload PDF or Word document (max 5MB)"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          name="resume"
          required
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="font-mono-label inline-flex w-fit cursor-pointer items-center gap-2.5 border border-brand bg-brand px-6 py-3.5 text-xs uppercase text-white transition-colors duration-200 hover:bg-brand-hover hover:border-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          "Submitting…"
        ) : (
          <>
            [ Submit Application <ArrowUpRight size={13} weight="bold" /> ]
          </>
        )}
      </button>
    </form>
  );
}
