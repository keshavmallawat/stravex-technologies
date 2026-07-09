"use client";

import Link from "next/link";
import { useState } from "react";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";

export function ListToolbar({
  q,
  onSearch,
  statusOptions,
  activeStatus,
  onStatusChange,
  trash,
  onToggleTrash,
  newHref,
  newLabel,
}: {
  q: string;
  onSearch: (q: string) => void;
  statusOptions?: { label: string; value: string }[];
  activeStatus?: string;
  onStatusChange?: (value: string) => void;
  trash: boolean;
  onToggleTrash: () => void;
  newHref?: string;
  newLabel?: string;
}) {
  const [search, setSearch] = useState(q);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearch(search);
          }}
          className="flex items-center gap-2 border border-ink/15 bg-white px-3 py-2"
        >
          <MagnifyingGlass size={14} className="text-ink/35" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-56 text-sm text-ink outline-none placeholder:text-ink/35"
          />
        </form>

        {!trash && statusOptions && onStatusChange && (
          <div className="flex gap-2">
            {statusOptions.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onStatusChange(tab.value)}
                className={`font-mono-label cursor-pointer border px-3 py-1.5 text-[10px] uppercase transition-colors ${
                  activeStatus === tab.value
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

      <div className="flex gap-2">
        <button
          onClick={onToggleTrash}
          className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
        >
          {trash ? "View Active" : "View Trash"}
        </button>
        {!trash && newHref && (
          <Link
            href={newHref}
            className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2.5 text-[10px] uppercase text-white hover:bg-brand-hover"
          >
            <Plus size={13} /> {newLabel ?? "New"}
          </Link>
        )}
      </div>
    </div>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`font-mono-label h-8 w-8 cursor-pointer border text-[11px] ${
            p === page ? "border-brand bg-brand text-white" : "border-ink/15 text-ink/50 hover:border-brand"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}
