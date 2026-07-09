import { PartnerForm } from "@/components/admin/partners/partner-form";

export const metadata = {
  title: "New Partner | Stravex CMS",
};

export default function NewPartnerPage() {
  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Partners / New ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">New Entry</h2>

      <div className="mt-6">
        <PartnerForm />
      </div>
    </div>
  );
}
