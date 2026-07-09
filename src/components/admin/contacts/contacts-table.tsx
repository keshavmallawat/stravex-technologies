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
} from "@phosphor-icons/react";
import type { ContactStatus } from "@/app/admin/(dashboard)/contacts/actions";
import { formatDate, formatDateTime } from "@/lib/format-date";
import {
  setContactStatusAction,
  softDeleteContactAction,
  restoreContactAction,
  permanentlyDeleteContactAction,
} from "@/app/admin/(dashboard)/contacts/actions";

export interface ContactRow {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
  { label: "Replied", value: "replied" },
  { label: "Archived", value: "archived" },
];

const statusStyles: Record<string, string> = {
  unread: "border-brand/40 text-brand",
  read: "border-ink/20 text-ink/55",
  replied: "border-emerald-600/40 text-emerald-700",
  archived: "border-amber-600/40 text-amber-700",
};

export function ContactsTable({
  contacts,
  total,
  page,
  pageSize,
  q,
  status,
  trash,
}: {
  contacts: ContactRow[];
  total: number;
  page: number;
  pageSize: number;
  q: string;
  status: string;
  trash: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(q);
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<ContactRow | null>(null);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function updateParams(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
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

  function viewContact(contact: ContactRow) {
    setViewing(contact);
    if (contact.status === "unread") {
      run(() => setContactStatusAction(contact.id, "read"));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono-label text-[10px] uppercase text-ink/40">
            [ {trash ? "Contacts / Trash" : "Contact Manager"} ]
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {total} Enquir{total === 1 ? "y" : "ies"}
          </h2>
        </div>
        <div className="flex gap-2">
          {!trash && (
            <>
              <a
                href={`/api/admin/contacts/export?format=csv${status ? `&status=${status}` : ""}`}
                className="font-mono-label flex cursor-pointer items-center gap-2 border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
              >
                <DownloadSimple size={13} /> CSV
              </a>
              <a
                href={`/api/admin/contacts/export?format=xlsx${status ? `&status=${status}` : ""}`}
                className="font-mono-label flex cursor-pointer items-center gap-2 border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
              >
                <DownloadSimple size={13} /> Excel
              </a>
            </>
          )}
          <button
            onClick={() => updateParams({ trash: trash ? null : "1", page: null })}
            className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
          >
            {trash ? "View Active" : "View Trash"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ q: search || null, page: null });
          }}
          className="flex items-center gap-2 border border-ink/15 bg-white px-3 py-2"
        >
          <MagnifyingGlass size={14} className="text-ink/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, company…"
            className="w-64 text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </form>

        {!trash && (
          <div className="flex gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => updateParams({ status: tab.value === "all" ? null : tab.value, page: null })}
                className={`font-mono-label cursor-pointer border px-3 py-1.5 text-[10px] uppercase transition-colors ${
                  status === tab.value || (tab.value === "all" && !status)
                    ? "border-brand bg-brand text-white"
                    : "border-ink/15 text-ink/50 hover:border-brand hover:text-brand"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/45">
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">From</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Message</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Status</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Received</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink/40">
                  No enquiries found.
                </td>
              </tr>
            )}
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b border-ink/5 last:border-0 hover:bg-mist/60">
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">{contact.name}</span>
                  {contact.company && <span className="block text-xs text-ink/45">{contact.company}</span>}
                  <span className="block text-xs text-ink/45">{contact.email}</span>
                </td>
                <td className="max-w-xs truncate px-4 py-3 text-ink/60">{contact.message}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono-label border px-2 py-1 text-[9px] uppercase ${statusStyles[contact.status] ?? ""}`}
                  >
                    {contact.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink/50">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {trash ? (
                      <>
                        <button
                          title="Restore"
                          onClick={() => run(() => restoreContactAction(contact.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <ArrowCounterClockwise size={15} />
                        </button>
                        <button
                          title="Delete Permanently"
                          onClick={() => setConfirmId(contact.id)}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-red-500"
                        >
                          <Trash size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          title="View"
                          onClick={() => viewContact(contact)}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Eye size={15} />
                        </button>
                        <select
                          value={contact.status}
                          onChange={(e) => run(() => setContactStatusAction(contact.id, e.target.value as ContactStatus))}
                          className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          title="Delete"
                          onClick={() => run(() => softDeleteContactAction(contact.id))}
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

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParams({ page: String(p) })}
              className={`font-mono-label h-8 w-8 cursor-pointer border text-[11px] ${
                p === page ? "border-brand bg-brand text-white" : "border-ink/15 text-ink/50 hover:border-brand"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-lg border border-ink/10 bg-white p-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono-label text-[10px] uppercase text-ink/40">
                  [ Enquiry ]
                </span>
                <h3 className="mt-1 text-lg font-semibold text-ink">{viewing.name}</h3>
                {viewing.company && <p className="text-sm text-ink/50">{viewing.company}</p>}
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
              <p>
                <a href={`mailto:${viewing.email}`} className="text-brand hover:underline">
                  {viewing.email}
                </a>
              </p>
              {viewing.phone && <p>{viewing.phone}</p>}
              <p className="text-xs text-ink/40">
                {formatDateTime(viewing.createdAt)}
              </p>
            </div>
            <p className="mt-4 whitespace-pre-wrap border-t border-ink/10 pt-4 text-sm leading-relaxed text-ink/75">
              {viewing.message}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => {
                  run(() => setContactStatusAction(viewing.id, "replied"));
                  setViewing(null);
                }}
                className="font-mono-label cursor-pointer border border-brand bg-brand px-4 py-2 text-[10px] uppercase text-white"
              >
                Mark Replied
              </button>
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
              Permanently delete this enquiry? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={isPending}
                onClick={() => {
                  run(() => permanentlyDeleteContactAction(confirmId));
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
