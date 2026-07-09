import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { PublicProduct } from "@/lib/products-data";
import { StatusBadge } from "./badge";

export function ProductCard({ product, index }: { product: PublicProduct; index: number }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex cursor-pointer flex-col justify-between overflow-hidden border border-night-border bg-night-elevated p-7 transition-colors duration-300 hover:border-brand/50"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono-label text-xs text-night-muted">
            [ {String(index + 1).padStart(2, "0")} ]
          </span>
          <StatusBadge status={product.displayStatus} />
        </div>

        <h3 className="mt-5 text-xl font-semibold text-white">{product.name}</h3>
        <p className="mt-1 font-mono-label text-[11px] uppercase text-brand">
          {product.category}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-night-muted">
          {product.positioning}
        </p>
      </div>

      <div className="font-mono-label mt-8 flex items-center gap-2 text-xs uppercase text-white/80 transition-colors duration-200 group-hover:text-brand">
        [ Explore system
        <ArrowUpRight size={13} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        ]
      </div>
    </Link>
  );
}
