"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Eye,
  Trash,
  ArrowCounterClockwise,
  MagnifyingGlass,
  DownloadSimple,
  X,
  Archive,
} from "@phosphor-icons/react";
import type { ApplicationStatus } from "@/app/admin/(dashboard)/careers/applications/actions";
import { formatDate, formatDateTime } from "@/lib/format-date";
import {
  setApplicationStatusAction,
  toggleApplicationArchivedAction,
  softDeleteApplicationAction,
  restoreApplicationAction,
  permanentlyDeleteApplicationAction,
} from "@/app/admin/(dashboard)/careers/applications/actions";

export interface ApplicationRow {
  id: string;
  applicantName: string;
  appliedRole: string;
  company: string | null;
  email: string;
  phone: string | null;
  resumeUrl: string;
  message: string | null;
  status: string;
  archived: boolean;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview Scheduled",
  selected: "Selected",
  rejected: "Rejected",
};

const statusStyles: Record<string, string> = {
  new: "border-brand/40 text-brand",
  reviewing: "border-ink/20 text-ink/55",
  shortlisted: "border-amber-600/40 text-amber-700",
  interview_scheduled: "border-amber-600/40 text-amber-700",
  selected: "border-emerald-600/40 text-emerald-700",
  rejected: "border-red-500/40 text-red-600",
};

export function ApplicationsTable({
  applications,
  total,
  q,
  trash,
}: {
  applications: ApplicationRow[];
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
  const [viewing, setViewing] = useState<ApplicationRow | null>(null);

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "applications");
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
            placeholder="Search applicants…"
            className="w-56 text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </div>
        <button
          onClick={() => updateParams({ trash: trash ? null : "1" })}
          className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
        >
          {trash ? "View Active" : "View Trash"}
        </button>
      </div>

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/45">
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Applicant</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Applied For</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Status</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Applied</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink/40">
                  No applications {total === 0 && !trash ? "yet." : "found."}
                </td>
              </tr>
            )}
            {applications.map((app) => (
              <tr key={app.id} className="border-b border-ink/5 last:border-0 hover:bg-mist/60">
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">{app.applicantName}</span>
                  <span className="block text-xs text-ink/45">{app.email}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{app.appliedRole}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono-label border px-2 py-1 text-[9px] uppercase ${statusStyles[app.status] ?? ""}`}
                  >
                    {STATUS_LABELS[app.status] ?? app.status}
                  </span>
                  {app.archived && (
                    <span className="font-mono-label ml-1.5 border border-ink/15 px-1.5 py-1 text-[9px] uppercase text-ink/40">
                      Archived
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-ink/50">
                  {formatDate(app.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {trash ? (
                      <>
                        <button
                          title="Restore"
                          onClick={() => run(() => restoreApplicationAction(app.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <ArrowCounterClockwise size={15} />
                        </button>
                        <button
                          title="Delete Permanently"
                          onClick={() => setConfirmId(app.id)}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-red-500"
                        >
                          <Trash size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          title="View"
                          onClick={() => setViewing(app)}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Eye size={15} />
                        </button>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Download Resume"
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <DownloadSimple size={15} />
                        </a>
                        <select
                          value={app.status}
                          onChange={(e) => run(() => setApplicationStatusAction(app.id, e.target.value as ApplicationStatus))}
                          className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                        >
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button
                          title={app.archived ? "Unarchive" : "Archive"}
                          onClick={() => run(() => toggleApplicationArchivedAction(app.id, !app.archived))}
                          className={`cursor-pointer p-1.5 hover:text-brand ${app.archived ? "text-amber" : "text-ink/45"}`}
                        >
                          <Archive size={15} weight={app.archived ? "fill" : "regular"} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => run(() => softDeleteApplicationAction(app.id))}
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

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-lg border border-ink/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-label text-[10px] uppercase text-ink/40">
                  [ Application ]
                </span>
                <h3 className="mt-1 text-lg font-semibold text-ink">{viewing.applicantName}</h3>
                <p className="text-sm text-ink/50">{viewing.appliedRole}</p>
              </div>
              <button
                onClick={() => setViewing(null)}
                aria-label="Close"
                className="cursor-pointer text-ink/40 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-1 text-sm text-ink/70">
              {viewing.company && <p>{viewing.company}</p>}
              <p>
                <a href={`mailto:${viewing.email}`} className="text-brand hover:underline">
                  {viewing.email}
                </a>
              </p>
              {viewing.phone && <p>{viewing.phone}</p>}
              <p className="text-xs text-ink/40">{formatDateTime(viewing.createdAt)}</p>
            </div>
            {viewing.message && (
              <p className="mt-4 whitespace-pre-wrap border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink/75">
                {viewing.message}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <a
                href={viewing.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2 text-[10px] uppercase text-white"
              >
                <DownloadSimple size={13} /> Download Resume
              </a>
              <button
                onClick={() => setViewing(null)}
                className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2 text-[10px] uppercase text-ink/60"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm border border-ink/10 bg-white p-6 text-center">
            <p className="text-sm text-ink/80">
              Permanently delete this application? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={isPending}
                onClick={() => {
                  run(() => permanentlyDeleteApplicationAction(confirmId));
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
