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
  Eye,
} from "@phosphor-icons/react";
import type { ProductWorkflowStatus } from "@/lib/product-types";
import { formatDate } from "@/lib/format-date";
import {
  setProductStatusAction,
  toggleProductFeaturedAction,
  softDeleteProductAction,
  restoreProductAction,
  permanentlyDeleteProductAction,
  duplicateProductAction,
  reorderProductAction,
} from "@/app/admin/(dashboard)/products/actions";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
  featured: boolean;
  updatedAt: string;
}

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const statusStyles: Record<string, string> = {
  draft: "border-ink/20 text-ink/55",
  published: "border-emerald-600/40 text-emerald-700",
  archived: "border-amber-600/40 text-amber-700",
};

export function ProductsTable({
  products,
  total,
  page,
  pageSize,
  q,
  status,
  category,
  categories,
  trash,
}: {
  products: ProductRow[];
  total: number;
  page: number;
  pageSize: number;
  q: string;
  status: string;
  category: string;
  categories: string[];
  trash: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(q);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono-label text-[10px] uppercase text-ink/40">
            [ {trash ? "Products / Trash" : "Products"} ]
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {total} Product{total === 1 ? "" : "s"}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => updateParams({ trash: trash ? null : "1", page: null })}
            className="font-mono-label cursor-pointer border border-ink/15 px-4 py-2.5 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
          >
            {trash ? "View Active" : "View Trash"}
          </button>
          {!trash && (
            <Link
              href="/admin/products/new"
              className="font-mono-label flex cursor-pointer items-center gap-2 border border-brand bg-brand px-4 py-2.5 text-[10px] uppercase text-white hover:bg-brand-hover"
            >
              <Plus size={13} /> New Product
            </Link>
          )}
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
            placeholder="Search products…"
            className="w-56 text-sm text-ink outline-none placeholder:text-ink/35"
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

        {!trash && categories.length > 0 && (
          <select
            value={category}
            onChange={(e) => updateParams({ category: e.target.value || null, page: null })}
            className="cursor-pointer border border-ink/15 bg-white px-3 py-2 text-xs text-ink/70"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-ink/45">
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Name</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Category</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Status</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase">Updated</th>
              <th className="font-mono-label px-4 py-3 text-[10px] uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink/40">
                  No products found.
                </td>
              </tr>
            )}
            {products.map((product, index) => (
              <tr key={product.id} className="border-b border-ink/5 last:border-0 hover:bg-mist/60">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {product.featured && <Star size={13} weight="fill" className="text-amber" />}
                    <span className="font-medium text-ink">{product.name}</span>
                  </div>
                  <span className="text-xs text-ink/40">/{product.slug}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{product.category}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-mono-label border px-2 py-1 text-[9px] uppercase ${statusStyles[product.status] ?? ""}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink/50">
                  {formatDate(product.updatedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {trash ? (
                      <>
                        <button
                          title="Restore"
                          onClick={() => run(() => restoreProductAction(product.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <ArrowCounterClockwise size={15} />
                        </button>
                        <button
                          title="Delete Permanently"
                          onClick={() => setConfirmId(product.id)}
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
                          onClick={() => run(() => reorderProductAction(product.id, "up", category || undefined))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand disabled:opacity-25"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          title="Move Down"
                          disabled={index === products.length - 1}
                          onClick={() => run(() => reorderProductAction(product.id, "down", category || undefined))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand disabled:opacity-25"
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button
                          title={product.featured ? "Unfeature" : "Feature"}
                          onClick={() => run(() => toggleProductFeaturedAction(product.id, !product.featured))}
                          className={`cursor-pointer p-1.5 hover:text-brand ${product.featured ? "text-amber" : "text-ink/45"}`}
                        >
                          <Star size={15} weight={product.featured ? "fill" : "regular"} />
                        </button>
                        <select
                          value={product.status}
                          onChange={(e) => run(() => setProductStatusAction(product.id, e.target.value as ProductWorkflowStatus))}
                          className="cursor-pointer border border-ink/15 px-1.5 py-1 text-xs text-ink"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                        <Link
                          href={
                            product.status === "published"
                              ? `/products/${product.slug}`
                              : `/admin/preview/products/${product.id}`
                          }
                          target="_blank"
                          title={product.status === "published" ? "View Live" : "Preview"}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}`}
                          title="Edit"
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <PencilSimple size={15} />
                        </Link>
                        <button
                          title="Duplicate"
                          onClick={() => run(() => duplicateProductAction(product.id))}
                          className="cursor-pointer p-1.5 text-ink/45 hover:text-brand"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => run(() => softDeleteProductAction(product.id))}
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

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-sm border border-ink/10 bg-white p-6 text-center">
            <p className="text-sm text-ink/80">
              Permanently delete this product? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                disabled={isPending}
                onClick={() => {
                  run(() => permanentlyDeleteProductAction(confirmId));
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
