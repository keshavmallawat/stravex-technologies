import { prisma } from "@/lib/prisma";

export interface PublicJobOpening {
  id: string;
  title: string;
  slug: string;
  department: string;
  employmentType: string;
  experience: string | null;
  location: string;
  workMode: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salary: string | null;
  featured: boolean;
}

function isNotExpired(expiryDate: Date | null) {
  return !expiryDate || expiryDate.getTime() >= Date.now();
}

export async function getPublishedJobOpenings(): Promise<PublicJobOpening[]> {
  const jobs = await prisma.jobOpening.findMany({
    where: { status: "published", deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });

  return jobs
    .filter((j) => isNotExpired(j.expiryDate))
    .map((j) => ({
      id: j.id,
      title: j.title,
      slug: j.slug,
      department: j.department,
      employmentType: j.employmentType,
      experience: j.experience,
      location: j.location,
      workMode: j.workMode,
      responsibilities: j.responsibilities as string[],
      requirements: j.requirements as string[],
      skills: j.skills as string[],
      salary: j.salary,
      featured: j.featured,
    }));
}

export async function getPublishedJobOpeningById(
  id: string
): Promise<PublicJobOpening | null> {
  const job = await prisma.jobOpening.findFirst({
    where: { id, status: "published", deletedAt: null },
  });
  if (!job || !isNotExpired(job.expiryDate)) return null;

  return {
    id: job.id,
    title: job.title,
    slug: job.slug,
    department: job.department,
    employmentType: job.employmentType,
    experience: job.experience,
    location: job.location,
    workMode: job.workMode,
    responsibilities: job.responsibilities as string[],
    requirements: job.requirements as string[],
    skills: job.skills as string[],
    salary: job.salary,
    featured: job.featured,
  };
}
