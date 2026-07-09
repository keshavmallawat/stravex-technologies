"use client";

import Image from "next/image";
import { useState } from "react";
import { Plus, X, FilePdf } from "@phosphor-icons/react";
import { MediaPickerModal } from "@/components/admin/products/media-picker-field";

export function GalleryEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <label className="font-mono-label block text-[10px] uppercase text-ink/40">
        [ Gallery Images ]
      </label>
      <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {items.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden border border-ink/10 bg-mist">
            {url.toLowerCase().endsWith(".pdf") ? (
              <div className="flex h-full w-full items-center justify-center text-ink/30">
                <FilePdf size={20} weight="thin" />
              </div>
            ) : (
              <Image src={url} alt="" fill className="object-cover" sizes="120px" />
            )}
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 flex h-6 w-6 cursor-pointer items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex aspect-square cursor-pointer items-center justify-center border border-dashed border-ink/20 text-ink/30 hover:border-brand hover:text-brand"
        >
          <Plus size={18} />
        </button>
      </div>

      {open && (
        <MediaPickerModal
          category="product-gallery"
          onClose={() => setOpen(false)}
          onSelect={(url) => {
            if (!items.includes(url)) onChange([...items, url]);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
