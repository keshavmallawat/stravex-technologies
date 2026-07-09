"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Images, X, FilePdf } from "@phosphor-icons/react";
import type { MediaCategory } from "@/lib/media";

interface PickerAsset {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  altText: string | null;
}

export function MediaPickerField({
  label,
  value,
  onChange,
  category,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  category: MediaCategory;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ {label} ]
      </label>
      <div className="mt-2 flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-ink/10 bg-mist">
            {value.toLowerCase().endsWith(".pdf") ? (
              <div className="flex h-full w-full items-center justify-center text-ink/30">
                <FilePdf size={20} weight="thin" />
              </div>
            ) : (
              <Image src={value} alt="" fill className="object-cover" sizes="64px" />
            )}
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-dashed border-ink/15 text-ink/25">
            <Images size={18} weight="thin" />
          </div>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/... or paste URL"
          className="flex-1 border border-ink/15 px-3 py-2 text-xs text-ink placeholder:text-ink/35"
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="font-mono-label shrink-0 cursor-pointer border border-ink/15 px-3 py-2 text-[10px] uppercase text-ink/60 hover:border-brand hover:text-brand"
        >
          Browse
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear"
            className="shrink-0 cursor-pointer text-ink/30 hover:text-red-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && (
        <MediaPickerModal
          category={category}
          onClose={() => setOpen(false)}
          onSelect={(url) => {
            onChange(url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function MediaPickerModal({
  category,
  onClose,
  onSelect,
}: {
  category: MediaCategory;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [assets, setAssets] = useState<PickerAsset[] | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const params = showAll ? "" : `?category=${category}`;
    fetch(`/api/admin/media${params}`)
      .then((r) => r.json())
      .then((data) => setAssets(data.assets ?? []))
      .catch(() => setAssets([]));
  }, [category, showAll]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="flex max-h-[80vh] w-full max-w-3xl flex-col border border-ink/10 bg-white">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
          <div>
            <span className="font-mono-label text-[10px] uppercase text-ink/40">
              [ Media Library ]
            </span>
            <h3 className="mt-1 text-sm font-semibold text-ink">Select an asset</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="font-mono-label cursor-pointer border border-ink/15 px-3 py-1.5 text-[10px] uppercase text-ink/50 hover:border-brand hover:text-brand"
            >
              {showAll ? "This Category" : "All Assets"}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer text-ink/40 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {assets === null ? (
            <p className="text-sm text-ink/45">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="text-sm text-ink/45">
              No assets found. Upload one from the Media Library first.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => onSelect(asset.url)}
                  className="group relative aspect-square cursor-pointer overflow-hidden border border-ink/10 bg-mist hover:border-brand"
                  title={asset.originalName}
                >
                  {asset.mimeType.startsWith("image/") ? (
                    <Image
                      src={asset.url}
                      alt={asset.altText ?? asset.originalName}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink/30">
                      <FilePdf size={22} weight="thin" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
