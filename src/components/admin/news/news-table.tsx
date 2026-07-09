"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { PencilSimple, Copy, Trash, ArrowCounterClockwise, Eye } from "@phosphor-icons/react";
import type { ContentStatus } from "@/lib/content-post-types";
import { ListToolbar, Pagination } from "@/components/admin/content/list-toolbar";
import { formatDate } from "@/lib/format-date";
import {
  setNewsPostStatusAction,
  softDeleteNewsPostAction,
  restoreNewsPostAction,
  permanentlyDeleteNewsPostAction,
  duplicateNewsPostAction,
} from "@/app/admin/(dashboard)/news/actions";

export interface NewsPostRow {
  id: string;
  title: string;
  slug: string;
  outlet: string | null;
  status: string;
  viewCount: number;
  updatedAt: string;
}

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const statusStyles: Record<string, string> = {
  draft: "border-ink/20 text-ink/55",
  scheduled: "border-amber-600/40 text-amber-700",
  published: "border-emerald-600/40 text-emerald-700",
  archived: "border-ink/20 text-ink/40",
};

export function NewsTable({
  posts,
  total,
  page,
  pageSize,
  q,
  status,
  trash,
}: {
  posts: NewsPostRow[];
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
  const [isPending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);
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

  return (
    <div>
      <div className="mb-6">
        <span className="font-mono-label text-[10px] uppercase text-ink/40">
          [ {trash ? "News / Trash" : "News Manager"} ]
        </span>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          {total} Item{total === 1 ? "" : "s"}
        </h2>
      </div>

      <ListToolbar
        q={q}
        onSearch={(v) => updateParams({ q: v || null, page: null })}
        statusOptions={trash ? undefined : STATUS_TABS}
        activeStatus={status || "all"}
        onStatusChange={(v) => updateParams({ status: v === "all" ? null : v, page: null })}
        trash={trash}
        onToggleTrash={() => updateParams({ trash: trash ? null : "1", page: null })}
        newHref="/admin/news/new"
        newLabel="New Item"
      />

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/45">
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Title</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Outlet</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Views</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Status</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Updated</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink/40">
                  No news items found.
                </td>
              </tr>
            )}
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-ink/5 last:border-0 hover:bg-mist/60">
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">{post.title}</span>
                  <span className="block text-xs text-ink/40">/{post.slug}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{post.outlet ?? "In-house"}</td>
                <td className="px-4 py-3 text-ink/70">{post.viewCount}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono-label border px-2 py-1 text-[9px] uppercase ${statusStyles[post.status] ?? ""}`}
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink/50">
                  {formatDate(post.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {trash ? (
                      <>
                        <button
                          title="Restore"
                          onClick={() => run(() => restoreNewsPostAction(post.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <ArrowCounterClockwise size={15} />
                        </button>
                        <button
                          title="Delete Permanently"
                          onClick={() => setConfirmId(post.id)}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-red-500"
                        >
                          <Trash size={15} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href={
                            post.status === "published"
                              ? `/news/${post.slug}`
                              : `/admin/preview/news/${post.id}`
                          }
                          target="_blank"
                          title={post.status === "published" ? "View Live" : "Preview"}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Eye size={15} />
                        </Link>
                        <select
                          value={post.status}
                          onChange={(e) => run(() => setNewsPostStatusAction(post.id, e.target.value as ContentStatus))}
                          className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                        >
                          <option value="draft">Draft</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                        <Link
                          href={`/admin/news/${post.id}`}
                          title="Edit"
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <PencilSimple size={15} />
                        </Link>
                        <button
                          title="Duplicate"
                          onClick={() => run(() => duplicateNewsPostAction(post.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => run(() => softDeleteNewsPostAction(post.id))}
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

      <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParams({ page: String(p) })} />

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm border border-ink/10 bg-white p-6 text-center">
            <p className="text-sm text-ink/80">Permanently delete this item? This cannot be undone.</p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={isPending}
                onClick={() => {
                  run(() => permanentlyDeleteNewsPostAction(confirmId));
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
