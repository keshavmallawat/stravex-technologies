"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Plus,
  PencilSimple,
  Copy,
  Trash,
  ArrowUp,
  ArrowDown,
  Star,
  ArrowCounterClockwise,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import type { JobOpeningStatus } from "@/lib/job-opening-types";
import {
  setJobOpeningStatusAction,
  toggleJobOpeningFeaturedAction,
  softDeleteJobOpeningAction,
  restoreJobOpeningAction,
  permanentlyDeleteJobOpeningAction,
  duplicateJobOpeningAction,
  reorderJobOpeningAction,
} from "@/app/admin/(dashboard)/careers/openings/actions";

export interface JobOpeningRow {
  id: string;
  title: string;
  slug: string;
  department: string;
  status: string;
  featured: boolean;
  applicationCount: number;
  updatedAt: string;
}

const statusStyles: Record<string, string> = {
  draft: "border-ink/20 text-ink/55",
  published: "border-emerald-600/40 text-emerald-700",
  archived: "border-amber-600/40 text-amber-700",
};

export function JobOpeningsTable({
  jobs,
  total,
  q,
  trash,
}: {
  jobs: JobOpeningRow[];
  total: number;
  q: string;
  trash: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(q);
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "openings");
    for (const [key, value] of Object.entries(patch)) {
      if (value === null || value === "") params.delete(key);
      else params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 border border-ink/15 bg-white px-3 py-2">
          <MagnifyingGlass size={14} className="text-ink/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && updateParams({ q: search || null })}
            placeholder="Search job openings…"
            className="w-56 text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => updateParams({ trash: trash ? null : "1" })}
            className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
          >
            {trash ? "View Active" : "View Trash"}
          </button>
          {!trash && (
            <Link
              href="/admin/careers/openings/new"
              className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2.5 text-[10px] uppercase text-white hover:bg-brand-hover"
            >
              <Plus size={13} /> New Opening
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/45">
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Title</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Department</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Applications</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Status</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink/40">
                  No job openings {total === 0 && !trash ? "yet." : "found."}
                </td>
              </tr>
            )}
            {jobs.map((job, index) => (
              <tr key={job.id} className="border-b border-ink/5 last:border-0 hover:bg-mist/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {job.featured && <Star size={13} weight="fill" className="text-amber" />}
                    <span className="font-medium text-ink">{job.title}</span>
                  </div>
                  <span className="text-xs text-ink/40">/{job.slug}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{job.department}</td>
                <td className="px-4 py-3 text-ink/70">{job.applicationCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono-label border px-2 py-1 text-[9px] uppercase ${statusStyles[job.status] ?? ""}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {trash ? (
                      <>
                        <button
                          title="Restore"
                          onClick={() => run(() => restoreJobOpeningAction(job.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <ArrowCounterClockwise size={15} />
                        </button>
                        <button
                          title="Delete Permanently"
                          onClick={() => setConfirmId(job.id)}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-red-500"
                        >
                          <Trash size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          title="Move Up"
                          disabled={index === 0}
                          onClick={() => run(() => reorderJobOpeningAction(job.id, "up"))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand disabled:opacity-25"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          title="Move Down"
                          disabled={index === jobs.length - 1}
                          onClick={() => run(() => reorderJobOpeningAction(job.id, "down"))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand disabled:opacity-25"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          title={job.featured ? "Unfeature" : "Feature"}
                          onClick={() => run(() => toggleJobOpeningFeaturedAction(job.id, !job.featured))}
                          className={`cursor-pointer p-1.5 hover:text-brand ${job.featured ? "text-amber" : "text-ink/45"}`}
                        >
                          <Star size={15} weight={job.featured ? "fill" : "regular"} />
                        </button>
                        <select
                          value={job.status}
                          onChange={(e) => run(() => setJobOpeningStatusAction(job.id, e.target.value as JobOpeningStatus))}
                          className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                        <Link
                          href={`/admin/careers/openings/${job.id}`}
                          title="Edit"
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <PencilSimple size={15} />
                        </Link>
                        <button
                          title="Duplicate"
                          onClick={() => run(() => duplicateJobOpeningAction(job.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => run(() => softDeleteJobOpeningAction(job.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-red-500"
                        >
                          <Trash size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm border border-ink/10 bg-white p-6 text-center">
            <p className="text-sm text-ink/80">
              Permanently delete this job opening? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={isPending}
                onClick={() => {
                  run(() => permanentlyDeleteJobOpeningAction(confirmId));
                  setConfirmId(null);
                }}
                className="font-mono-label cursor-pointer border border-red-500 bg-red-500 px-4 py-2 text-[10px] uppercase text-white"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2 text-[10px] uppercase text-ink/60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
