"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

const MESSAGE_LIMIT = 1000;

export function ContactForm() {
  const [messageLength, setMessageLength] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          phone: data.get("phone"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setMessageLength(0);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 border border-brand/30 bg-brand-soft px-6 py-12 text-center">
        <CheckCircle size={28} weight="fill" className="text-brand" />
        <p className="text-sm font-medium text-ink">Message sent.</p>
        <p className="max-w-sm text-sm text-ink/60">
          Thanks for reaching out — the Stravex team will follow up shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="font-mono-label mt-2 cursor-pointer text-xs uppercase text-brand hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="font-mono-label text-xs uppercase text-ink/50">
            Full Name <span className="text-brand">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Enter your full name"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
        <div>
          <label htmlFor="company" className="font-mono-label text-xs uppercase text-ink/50">
            Company / Organization <span className="text-brand">*</span>
          </label>
          <input
            id="company"
            name="company"
            type="text"
            required
            autoComplete="organization"
            placeholder="Enter your company or organization"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="font-mono-label text-xs uppercase text-ink/50">
            Contact Number <span className="normal-case text-ink/30">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Enter your contact number (optional)"
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
            placeholder="Enter your email address"
            className="mt-2 w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
          />
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="message" className="font-mono-label text-xs uppercase text-ink/50">
            Message <span className="text-brand">*</span>
          </label>
          <span className="font-mono-label text-[10px] text-ink/30">
            {messageLength}/{MESSAGE_LIMIT}
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={MESSAGE_LIMIT}
          onChange={(e) => setMessageLength(e.target.value.length)}
          placeholder="Tell us about your requirements, questions, partnership inquiry, or how we can help..."
          className="mt-2 w-full resize-none border border-ink/20 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-brand"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="font-mono-label inline-flex w-fit cursor-pointer items-center gap-2.5 border border-brand bg-brand px-6 py-3.5 text-xs uppercase text-white transition-colors duration-200 hover:bg-brand-hover hover:border-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? (
          "Sending…"
        ) : (
          <>
            [ Send Message <ArrowUpRight size={13} weight="bold" /> ]
          </>
        )}
      </button>
    </form>
  );
}
