import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { JobOpeningsTable } from "@/components/admin/careers/job-openings-table";
import { ApplicationsTable } from "@/components/admin/careers/applications-table";

export const metadata = {
  title: "Careers | Stravex CMS",
};

export default async function AdminCareersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; trash?: string }>;
}) {
  const { tab = "openings", q = "", trash: trashParam } = await searchParams;
  const trash = trashParam === "1";
  const activeTab = tab === "applications" ? "applications" : "openings";

  return (
    <div>
      <span className="font-mono-label text-[10px] uppercase text-ink/40">[ Careers ]</span>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Job Openings & Applications</h2>

      <div className="mt-6 flex gap-2 border-b border-ink/10">
        <Link
          href="/admin/careers?tab=openings"
          className={`font-mono-label -mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[10px] uppercase ${
            activeTab === "openings" ? "border-brand text-brand" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Openings
        </Link>
        <Link
          href="/admin/careers?tab=applications"
          className={`font-mono-label -mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[10px] uppercase ${
            activeTab === "applications" ? "border-brand text-brand" : "border-transparent text-ink/50 hover:text-ink"
          }`}
        >
          Applications
        </Link>
      </div>

      <div className="mt-6">
        {activeTab === "openings" ? (
          <JobOpeningsTab q={q} trash={trash} />
        ) : (
          <ApplicationsTab q={q} trash={trash} />
        )}
      </div>
    </div>
  );
}

async function JobOpeningsTab({ q, trash }: { q: string; trash: boolean }) {
  const where = {
    deletedAt: trash ? { not: null } : null,
    ...(q ? { OR: [{ title: { contains: q } }, { department: { contains: q } }] } : {}),
  };

  const jobs = await prisma.jobOpening.findMany({
    where,
    orderBy: trash ? { updatedAt: "desc" } : { sortOrder: "asc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <JobOpeningsTable
      jobs={jobs.map((j) => ({
        id: j.id,
        title: j.title,
        slug: j.slug,
        department: j.department,
        status: j.status,
        featured: j.featured,
        applicationCount: j._count.applications,
        updatedAt: j.updatedAt.toISOString(),
      }))}
      total={jobs.length}
      q={q}
      trash={trash}
    />
  );
}

async function ApplicationsTab({ q, trash }: { q: string; trash: boolean }) {
  const where = {
    deletedAt: trash ? { not: null } : null,
    ...(q
      ? {
          OR: [
            { applicantName: { contains: q } },
            { email: { contains: q } },
            { appliedRole: { contains: q } },
          ],
        }
      : {}),
  };

  const applications = await prisma.careerApplication.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <ApplicationsTable
      applications={applications.map((a) => ({
        id: a.id,
        applicantName: a.applicantName,
        appliedRole: a.appliedRole,
        company: a.company,
        email: a.email,
        phone: a.phone,
        resumeUrl: a.resumeUrl,
        message: a.message,
        status: a.status,
        archived: a.archived,
        createdAt: a.createdAt.toISOString(),
      }))}
      total={applications.length}
      q={q}
      trash={trash}
    />
  );
}
