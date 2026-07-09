import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PartnerForm } from "@/components/admin/partners/partner-form";
import type { PartnerFormValues } from "@/lib/partner-types";

export const metadata = {
  title: "Edit Partner | Stravex CMS",
};

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });

  if (!partner) notFound();

  const initialValues: PartnerFormValues = {
    name: partner.name,
    description: partner.description ?? "",
    logoUrl: partner.logoUrl ?? "",
    websiteUrl: partner.websiteUrl ?? "",
    category: partner.category as PartnerFormValues["category"],
    status: partner.status as PartnerFormValues["status"],
  };

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Partners / Edit ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{partner.name}</h2>

      <div className="mt-6">
        <PartnerForm partnerId={partner.id} initialValues={initialValues} />
      </div>
    </div>
  );
}
