import { JobOpeningForm } from "@/components/admin/careers/job-opening-form";

export const metadata = {
  title: "New Job Opening | Stravex CMS",
};

export default function NewJobOpeningPage() {
  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Careers / New Opening ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">New Job Opening</h2>

      <div className="mt-6">
        <JobOpeningForm />
      </div>
    </div>
  );
}
