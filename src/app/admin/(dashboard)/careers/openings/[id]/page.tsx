import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JobOpeningForm } from "@/components/admin/careers/job-opening-form";
import type { JobOpeningFormValues } from "@/lib/job-opening-types";

export const metadata = {
  title: "Edit Job Opening | Stravex CMS",
};

export default async function EditJobOpeningPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.jobOpening.findUnique({ where: { id } });

  if (!job) notFound();

  const initialValues: JobOpeningFormValues = {
    title: job.title,
    slug: job.slug,
    status: job.status as JobOpeningFormValues["status"],
    featured: job.featured,
    department: job.department,
    employmentType: job.employmentType,
    experience: job.experience ?? "",
    location: job.location,
    workMode: job.workMode as JobOpeningFormValues["workMode"],
    responsibilities: job.responsibilities as string[],
    requirements: job.requirements as string[],
    skills: job.skills as string[],
    salary: job.salary ?? "",
    expiryDate: job.expiryDate ? job.expiryDate.toISOString().slice(0, 10) : "",
  };

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">
        [ Careers / Edit Opening ]
      </span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{job.title}</h2>

      <div className="mt-6">
        <JobOpeningForm jobId={job.id} initialValues={initialValues} />
      </div>
    </div>
  );
}
