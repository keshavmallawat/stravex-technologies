"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import {
  UploadSimple,
  Trash,
  FilePdf,
  X,
  Check,
  PencilSimple,
  CopySimple,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import {
  MEDIA_CATEGORIES,
  MEDIA_CATEGORY_LABELS,
  formatBytes,
  type MediaCategory,
} from "@/lib/media";
import {
  uploadMediaAction,
  deleteMediaAction,
  updateMediaAction,
  replaceMediaAction,
} from "@/app/admin/(dashboard)/media/actions";

export interface MediaAssetDTO {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  category: string;
  altText: string | null;
  createdAt: string;
}

export function MediaLibraryClient({
  assets,
  activeCategory,
}: {
  assets: MediaAssetDTO[];
  activeCategory: string | null;
}) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="font-mono-label text-[10px] uppercase text-ink/40">
            [ Media Library ]
          </span>
          <h2 className="mt-2 text-2xl font-semibold text-ink">
            {assets.length} Asset{assets.length === 1 ? "" : "s"}
          </h2>
        </div>
      </div>

      <UploadPanel />

      <div className="mt-8 flex flex-wrap gap-2">
        <span className="font-mono-label mr-1 self-center text-[10px] uppercase text-ink/35">
          Folders:
        </span>
        <Link
          href="/admin/media"
          className={`font-mono-label cursor-pointer border px-3 py-1.5 text-[10px] uppercase transition-colors ${
            !activeCategory
              ? "border-brand bg-brand text-white"
              : "border-ink/15 text-ink/50 hover:border-brand hover:text-brand"
          }`}
        >
          All
        </Link>
        {MEDIA_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/admin/media?category=${cat}`}
            className={`font-mono-label cursor-pointer border px-3 py-1.5 text-[10px] uppercase transition-colors ${
              activeCategory === cat
                ? "border-brand bg-brand text-white"
                : "border-ink/15 text-ink/50 hover:border-brand hover:text-brand"
            }`}
          >
            {MEDIA_CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {assets.length === 0 ? (
        <div className="mt-8 flex min-h-[30vh] flex-col items-center justify-center border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
          <p className="text-sm text-ink/50">
            No media assets{activeCategory ? " in this folder" : ""} yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {assets.map((asset) => (
            <MediaCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  );
}

function UploadPanel() {
  const [category, setCategory] = useState<MediaCategory>("other");
  const [altText, setAltText] = useState("");
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function uploadFiles(files: File[]) {
    if (files.length === 0) {
      setError("Choose at least one file.");
      return;
    }
    setError(null);
    startTransition(async () => {
      for (const file of files) {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("category", category);
        formData.set("altText", altText);
        const result = await uploadMediaAction(formData);
        if (result?.error) {
          setError(`${file.name}: ${result.error}`);
          return;
        }
      }
      formRef.current?.reset();
      setFileNames([]);
      setAltText("");
      window.location.reload();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    uploadFiles(Array.from(fileInputRef.current?.files ?? []));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-6 flex flex-col gap-4 border border-ink/10 bg-white p-6 sm:flex-row sm:items-end sm:flex-wrap"
    >
      <div className="flex-1 min-w-[220px]">
        <label className="font-mono-label block text-[10px] uppercase text-ink/40">
          [ File(s) ]
        </label>
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`mt-2 flex w-full cursor-pointer items-center gap-2 border border-dashed px-4 py-2.5 text-sm transition-colors ${
            dragging ? "border-brand bg-brand-soft text-brand" : "border-ink/20 text-ink/60 hover:border-brand hover:text-brand"
          }`}
        >
          <UploadSimple size={16} />
          {fileNames.length > 0
            ? `${fileNames.length} file${fileNames.length === 1 ? "" : "s"} selected`
            : "Choose or drag files (image or PDF, max 15MB each)"}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf"
          className="hidden"
          onChange={(e) => setFileNames(Array.from(e.target.files ?? []).map((f) => f.name))}
        />
      </div>

      <div className="min-w-[180px]">
        <label className="font-mono-label block text-[10px] uppercase text-ink/40">
          [ Folder ]
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MediaCategory)}
          className="mt-2 w-full cursor-pointer border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink"
        >
          {MEDIA_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {MEDIA_CATEGORY_LABELS[cat]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[220px]">
        <label className="font-mono-label block text-[10px] uppercase text-ink/40">
          [ Alt Text (optional, applies to all) ]
        </label>
        <input
          type="text"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          placeholder="Describe this asset"
          className="mt-2 w-full border border-ink/15 px-3 py-2.5 text-sm text-ink placeholder:text-ink/35"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="font-mono-label cursor-pointer border border-brand bg-brand px-6 py-2.5 text-xs uppercase text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Uploading…" : "Upload"}
      </button>

      {error && <p className="w-full text-xs text-red-600">{error}</p>}
    </form>
  );
}

function MediaCard({ asset }: { asset: MediaAssetDTO }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [altText, setAltText] = useState(asset.altText ?? "");
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const isImage = asset.mimeType.startsWith("image/");

  function handleDelete() {
    startTransition(async () => {
      await deleteMediaAction(asset.id);
      window.location.reload();
    });
  }

  function handleSaveAlt() {
    startTransition(async () => {
      await updateMediaAction(asset.id, { altText });
      setEditing(false);
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(new URL(asset.url, window.location.origin).toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleReplaceFile(file: File) {
    const formData = new FormData();
    formData.set("file", file);
    startTransition(async () => {
      await replaceMediaAction(asset.id, formData);
      window.location.reload();
    });
  }

  return (
    <div className="group relative flex flex-col border border-ink/10 bg-white">
      <div className="relative aspect-square w-full overflow-hidden bg-mist">
        {isImage ? (
          <Image
            src={asset.url}
            alt={asset.altText ?? asset.originalName}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink/30">
            <FilePdf size={32} weight="thin" />
            <span className="font-mono-label text-[9px] uppercase">PDF</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-start justify-end gap-1.5 bg-black/0 p-2 opacity-0 transition-opacity duration-150 group-hover:bg-black/10 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy URL"
            className="flex h-7 w-7 cursor-pointer items-center justify-center border border-white/40 bg-black/60 text-white hover:border-brand hover:bg-brand"
          >
            {copied ? <Check size={13} /> : <CopySimple size={13} />}
          </button>
          <button
            type="button"
            onClick={() => replaceInputRef.current?.click()}
            aria-label="Replace file"
            className="flex h-7 w-7 cursor-pointer items-center justify-center border border-white/40 bg-black/60 text-white hover:border-brand hover:bg-brand"
          >
            <ArrowsClockwise size={13} />
          </button>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleReplaceFile(file);
            }}
          />
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            aria-label="Edit"
            className="flex h-7 w-7 cursor-pointer items-center justify-center border border-white/40 bg-black/60 text-white hover:border-brand hover:bg-brand"
          >
            <PencilSimple size={13} />
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete"
            className="flex h-7 w-7 cursor-pointer items-center justify-center border border-white/40 bg-black/60 text-white hover:border-red-500 hover:bg-red-500"
          >
            <Trash size={13} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="truncate text-xs font-medium text-ink" title={asset.originalName}>
          {asset.originalName}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-mono-label text-[9px] uppercase text-ink/35">
            {MEDIA_CATEGORY_LABELS[asset.category as MediaCategory] ?? asset.category}
          </span>
          <span className="text-[10px] text-ink/35">{formatBytes(asset.size)}</span>
        </div>
      </div>

      {editing && (
        <div className="absolute inset-0 z-10 flex flex-col gap-3 bg-white p-4">
          <label className="font-mono-label text-[9px] uppercase text-ink/40">
            [ Alt Text ]
          </label>
          <input
            autoFocus
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="border border-ink/15 px-2 py-1.5 text-xs"
          />
          <div className="mt-auto flex gap-2">
            <button
              type="button"
              onClick={handleSaveAlt}
              disabled={isPending}
              className="font-mono-label flex-1 cursor-pointer border border-brand bg-brand py-1.5 text-[10px] uppercase text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="font-mono-label cursor-pointer border border-ink/15 px-3 py-1.5 text-[10px] uppercase text-ink/60"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white p-4 text-center">
          <p className="text-xs text-ink/70">Delete this asset permanently?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isPending}
              className="font-mono-label cursor-pointer border border-red-500 bg-red-500 px-3 py-1.5 text-[10px] uppercase text-white"
            >
              {isPending ? "Deleting…" : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="font-mono-label cursor-pointer border border-ink/15 px-3 py-1.5 text-[10px] uppercase text-ink/60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
