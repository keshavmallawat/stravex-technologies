import { PAGE_SEO_KEYS, PAGE_SEO_LABELS, getAllPageSeoOverrides } from "@/lib/seo-data";
import { PageSeoCard } from "@/components/admin/seo/page-seo-card";

export const metadata = {
  title: "SEO Manager | Stravex CMS",
};

export default async function AdminSeoPage() {
  const overrides = await getAllPageSeoOverrides();

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">[ SEO Manager ]</span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Per-Page SEO Overrides</h2>
      <p className="mt-1.5 text-sm text-ink/55">
        Override the title, description, OG image, canonical URL, robots, and keywords for any
        page. Leave fields blank to keep using that page&apos;s default copy.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {PAGE_SEO_KEYS.map((key) => {
          const override = overrides[key];
          return (
            <PageSeoCard
              key={key}
              pageKey={key}
              label={PAGE_SEO_LABELS[key]}
              initialValues={{
                title: override?.title ?? "",
                metaDescription: override?.metaDescription ?? "",
                ogImageUrl: override?.ogImageUrl ?? "",
                canonicalUrl: override?.canonicalUrl ?? "",
                robots: override?.robots ?? "index,follow",
                keywords: override?.keywords ?? [],
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
