import { getHomepageSections } from "@/lib/homepage-data";
import { HomepageSectionCard } from "@/components/admin/homepage/homepage-section-card";

export const metadata = {
  title: "Homepage | Stravex CMS",
};

export default async function AdminHomepagePage() {
  const sections = await getHomepageSections();

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">[ Homepage ]</span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Homepage Sections</h2>
      <p className="mt-1.5 text-sm text-ink/55">
        Control visibility, order, copy, CTAs, and media for each homepage section. Layout and
        design stay as built — this only changes content.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {sections.map((section, i) => (
          <HomepageSectionCard
            key={section.key}
            section={section}
            isFirst={i === 0}
            isLast={i === sections.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
