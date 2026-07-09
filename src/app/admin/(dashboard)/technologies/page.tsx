import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TechSolutionManager } from "@/components/admin/technologies/tech-solution-manager";
import {
  createTechnologyAction,
  updateTechnologyAction,
  setTechnologyStatusAction,
  softDeleteTechnologyAction,
} from "@/app/admin/(dashboard)/technologies/tech-actions";
import {
  createSolutionAction,
  updateSolutionAction,
  setSolutionStatusAction,
  softDeleteSolutionAction,
} from "@/app/admin/(dashboard)/technologies/solution-actions";

export const metadata = {
  title: "Technologies & Solutions | Stravex CMS",
};

export default async function AdminTechnologiesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab = "technologies" } = await searchParams;
  const activeTab = tab === "solutions" ? "solutions" : "technologies";

  const [technologies, solutions, products] = await Promise.all([
    prisma.technology.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.solution.findMany({ where: { deletedAt: null }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({ where: { deletedAt: null }, select: { slug: true, name: true } }),
  ]);

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Technologies & Solutions ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Capability & Use Case Taxonomy</h2>

      <div className="mt-6 flex gap-2 border-b border-ink/10">
        <Link
          href="/admin/technologies?tab=technologies"
          className={`font-mono-label -mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[10px] uppercase ${
            activeTab === "technologies" ? "border-brand text-brand" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Technologies
        </Link>
        <Link
          href="/admin/technologies?tab=solutions"
          className={`font-mono-label -mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[10px] uppercase ${
            activeTab === "solutions" ? "border-brand text-brand" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Solutions
        </Link>
      </div>

      <div className="mt-6">
        {activeTab === "technologies" ? (
          <TechSolutionManager
            label="Technologies"
            relatedLabel="Applied In"
            items={technologies.map((t) => ({
              id: t.id,
              name: t.name,
              slug: t.slug,
              description: t.description ?? "",
              relatedSlugs: t.appliedInProductSlugs as string[],
              status: t.status,
            }))}
            otherProducts={products}
            createAction={createTechnologyAction}
            updateAction={updateTechnologyAction}
            setStatusAction={setTechnologyStatusAction}
            softDeleteAction={softDeleteTechnologyAction}
          />
        ) : (
          <TechSolutionManager
            label="Solutions"
            relatedLabel="Related Products"
            items={solutions.map((s) => ({
              id: s.id,
              name: s.name,
              slug: s.slug,
              description: s.description ?? "",
              relatedSlugs: s.relatedProductSlugs as string[],
              status: s.status,
            }))}
            otherProducts={products}
            createAction={createSolutionAction}
            updateAction={updateSolutionAction}
            setStatusAction={setSolutionStatusAction}
            softDeleteAction={softDeleteSolutionAction}
          />
        )}
      </div>
    </div>
  );
}
