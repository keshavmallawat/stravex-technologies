"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { PencilSimple, Trash, ArrowUp, ArrowDown, ArrowCounterClockwise } from "@phosphor-icons/react";
import type { PartnerStatus } from "@/lib/partner-types";
import {
  setPartnerStatusAction,
  softDeletePartnerAction,
  restorePartnerAction,
  permanentlyDeletePartnerAction,
  reorderPartnerAction,
} from "@/app/admin/(dashboard)/partners/actions";

export interface PartnerRow {
  id: string;
  name: string;
  category: string;
  status: string;
}

export function PartnersTable({
  partners,
  total,
  trash,
}: {
  partners: PartnerRow[];
  total: number;
  trash: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);

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

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono-label text-[10px] uppercase text-ink/40">
            [ {trash ? "Partners / Trash" : "Incubators & Partners"} ]
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {total} Entr{total === 1 ? "y" : "ies"}
          </h2>
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
              href="/admin/partners/new"
              className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2.5 text-[10px] uppercase text-white hover:bg-brand-hover"
            >
              New Entry
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/45">
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Name</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Category</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Status</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-ink/40">
                  No entries found.
                </td>
              </tr>
            )}
            {partners.map((partner, index) => (
              <tr key={partner.id} className="border-b border-ink/5 last:border-0 hover:bg-mist/60">
                <td className="px-4 py-3 font-medium text-ink">{partner.name}</td>
                <td className="px-4 py-3 text-ink/70 capitalize">{partner.category}</td>
                <td className="px-4 py-3">
                  <span className="font-mono-label border border-ink/20 px-2 py-1 text-[9px] uppercase text-ink/55">
                    {partner.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {trash ? (
                      <>
                        <button
                          title="Restore"
                          onClick={() => run(() => restorePartnerAction(partner.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <ArrowCounterClockwise size={15} />
                        </button>
                        <button
                          title="Delete Permanently"
                          onClick={() => setConfirmId(partner.id)}
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
                          onClick={() => run(() => reorderPartnerAction(partner.id, "up"))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand disabled:opacity-25"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          title="Move Down"
                          disabled={index === partners.length - 1}
                          onClick={() => run(() => reorderPartnerAction(partner.id, "down"))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand disabled:opacity-25"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <select
                          value={partner.status}
                          onChange={(e) => run(() => setPartnerStatusAction(partner.id, e.target.value as PartnerStatus))}
                          className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        <Link
                          href={`/admin/partners/${partner.id}`}
                          title="Edit"
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <PencilSimple size={15} />
                        </Link>
                        <button
                          title="Delete"
                          onClick={() => run(() => softDeletePartnerAction(partner.id))}
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
            <p className="text-sm text-ink/80">Permanently delete this entry? This cannot be undone.</p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={isPending}
                onClick={() => {
                  run(() => permanentlyDeletePartnerAction(confirmId));
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
